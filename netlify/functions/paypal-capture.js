// Crea y captura órdenes de PayPal del lado del servidor (Orders v2 API).
// El cliente nunca ve el Client Secret; todo pasa por aquí.
//
// SEGURIDAD: el monto NUNCA se toma del navegador. El navegador solo indica la
// vigencia (1–5 años) y el precio se busca en la tabla oficial
// (src/data/firma-precios.js). Al capturar se vuelve a verificar que lo cobrado
// coincida con esa tarifa.
//
// Documentación: https://developer.paypal.com/api/orders/v2/

import { firmaPorAnios } from '../../src/data/firma-precios.js';
import { clean, notify } from './lib/notify.js';
import { buildPaymentEmail, sendCustomerEmail } from './lib/emails.js';

function apiBase() {
  return process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const basic = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || 'No se pudo autenticar con PayPal.');
  return data.access_token;
}

const json = (statusCode, obj) => ({ statusCode, body: JSON.stringify(obj) });

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return json(500, { success: false, message: 'Credenciales de PayPal no configuradas en Netlify.' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { success: false, message: 'Body inválido.' });
  }

  try {
    // ─── Crear orden ───
    if (payload.action === 'create') {
      const plan = firmaPorAnios(payload.years);
      if (!plan) {
        return json(400, { success: false, message: 'Vigencia inválida.' });
      }

      const accessToken = await getAccessToken();
      const res = await fetch(`${apiBase()}/v2/checkout/orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: `firma-${plan.years}a`,
              // custom_id viaja con la orden y vuelve en la captura: así la vigencia
              // que se notifica es la que se cobró, no la que diga el navegador.
              custom_id: String(plan.years),
              description: `Firma Electrónica — DEVCORP S.A.S. (${plan.label})`,
              amount: { currency_code: 'USD', value: plan.price.toFixed(2) },
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return json(500, { success: false, message: 'No se pudo crear la orden.', data });
      }
      return json(200, { id: data.id });
    }

    // ─── Capturar orden ───
    if (payload.action === 'capture') {
      const { orderID, customer } = payload;
      if (!orderID || typeof orderID !== 'string') {
        return json(400, { success: false, message: 'Falta orderID.' });
      }

      const accessToken = await getAccessToken();
      const res = await fetch(`${apiBase()}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      const unit = data?.purchase_units?.[0];
      const capture = unit?.payments?.captures?.[0];
      if (!res.ok || data.status !== 'COMPLETED' || !capture) {
        return json(200, { success: false, message: 'El pago no fue completado.', data });
      }

      // Verificación: lo cobrado debe coincidir con la tarifa de la vigencia de la orden.
      const plan = firmaPorAnios(capture.custom_id || unit.custom_id);
      const paidCents = Math.round(Number(capture.amount?.value) * 100);
      const verified =
        !!plan && capture.amount?.currency_code === 'USD' && paidCents === Math.round(plan.price * 100);

      // Confirmación al cliente (solo si hay proveedor de correo configurado).
      const mail = buildPaymentEmail({
        nombre: customer?.nombre,
        vigencia: plan ? plan.label : undefined,
        monto: capture.amount?.value,
        metodo: 'PayPal',
        codigo: capture.id,
        review: !verified,
      });
      const enviado = await sendCustomerEmail({ to: customer?.correo || data?.payer?.email_address, ...mail });

      await notify(
        `${verified ? 'Pago recibido' : '⚠️ REVISAR pago'} (PayPal) — Firma Electrónica — ${clean(customer?.nombre, 80)}`,
        {
          'Verificación': verified
            ? 'OK — el monto coincide con la tarifa de la vigencia'
            : '⚠️ REVISAR — el monto o la vigencia no coinciden con la tarifa oficial',
          'Nombre': clean(customer?.nombre),
          'Cédula': clean(customer?.cedula),
          'Correo': clean(customer?.correo),
          'Teléfono': clean(customer?.telefono),
          'Tipo': clean(customer?.tipo),
          'RUC': clean(customer?.ruc),
          'Vigencia comprada': plan ? plan.label : clean(customer?.vigencia),
          'Monto': `$${clean(capture.amount?.value)}`,
          'Método de pago': 'PayPal',
          'ID de transacción': clean(capture.id),
          'Correo de la cuenta PayPal': clean(data?.payer?.email_address),
          'Confirmación enviada al cliente': enviado.sent ? 'Sí' : `No (${enviado.reason})`,
        }
      );

      return json(200, {
        success: true,
        review: !verified,
        transactionId: capture.id,
        amount: capture.amount.value,
      });
    }

    return json(400, { success: false, message: 'Acción no reconocida.' });
  } catch (err) {
    console.error('paypal-capture error:', String(err));
    return json(500, { success: false, message: 'Error al procesar con PayPal.' });
  }
};

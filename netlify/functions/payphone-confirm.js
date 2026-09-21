// Verifica del lado del servidor una transacción de PayPhone (Cajita de Pagos).
// Nunca confía en el resultado que reporta el navegador: siempre confirma
// contra la API de PayPhone usando el token secreto (variable de entorno).
//
// SEGURIDAD: en la Cajita de Pagos el monto lo fija el navegador, así que aquí
// se compara lo que PayPhone realmente cobró contra la tarifa oficial de la
// vigencia (src/data/firma-precios.js). Si no coincide, el pago se marca para
// revisión manual y DEVCORP recibe una alerta.
//
// Documentación: https://docs.payphone.app/cajita-de-pagos

import { firmaPorAnios, firmaCentavos } from '../../src/data/firma-precios.js';
import { clean, notify } from './lib/notify.js';
import { buildPaymentEmail, sendCustomerEmail } from './lib/emails.js';

const json = (statusCode, obj) => ({ statusCode, body: JSON.stringify(obj) });

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.PAYPHONE_TOKEN;
  if (!token) {
    return json(500, { success: false, message: 'PAYPHONE_TOKEN no configurado en Netlify.' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { success: false, message: 'Body inválido.' });
  }

  const { id, clientTxId, customer } = payload;
  if (!id || !clientTxId) {
    return json(400, { success: false, message: 'Faltan id o clientTxId.' });
  }

  try {
    const res = await fetch('https://paymentbox.payphonetodoesposible.com/api/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: Number(id), clientTxId: String(clientTxId) }),
    });

    const data = await res.json();

    if (!res.ok || data.statusCode !== 3 || data.transactionStatus !== 'Approved') {
      return json(200, { success: false, message: 'El pago no fue aprobado.', data });
    }

    // Verificación: el monto cobrado debe coincidir con la tarifa de la vigencia.
    const plan = firmaPorAnios(customer?.years);
    const verified = !!plan && Number(data.amount) === firmaCentavos(plan);

    // Confirmación al cliente (solo si hay proveedor de correo configurado).
    const mail = buildPaymentEmail({
      nombre: customer?.nombre,
      vigencia: plan ? plan.label : undefined,
      monto: (Number(data.amount) / 100).toFixed(2),
      metodo: 'PayPhone',
      codigo: data.transactionId,
      review: !verified,
    });
    const enviado = await sendCustomerEmail({ to: customer?.correo, ...mail });

    await notify(
      `${verified ? 'Pago recibido' : '⚠️ REVISAR pago'} (PayPhone) — Firma Electrónica — ${clean(customer?.nombre, 80)}`,
      {
        'Verificación': verified
          ? 'OK — el monto coincide con la tarifa de la vigencia'
          : plan
            ? '⚠️ REVISAR — el monto cobrado no coincide con la tarifa de la vigencia declarada'
            : '⚠️ REVISAR — no llegaron datos válidos del cliente (¿otro navegador o vigencia inválida?)',
        'Nombre': clean(customer?.nombre),
        'Cédula': clean(customer?.cedula),
        'Correo': clean(customer?.correo),
        'Teléfono': clean(customer?.telefono),
        'Tipo': clean(customer?.tipo),
        'RUC': clean(customer?.ruc),
        'Vigencia declarada': plan ? plan.label : clean(customer?.vigencia),
        'Monto': `$${(Number(data.amount) / 100).toFixed(2)}`,
        'Método de pago': 'PayPhone',
        'ID de transacción': clean(data.transactionId),
        'Código de autorización': clean(data.authorizationCode),
        'Confirmación enviada al cliente': enviado.sent ? 'Sí' : `No (${enviado.reason})`,
      }
    );

    return json(200, {
      success: true,
      review: !verified,
      transactionId: data.transactionId,
      amount: data.amount,
    });
  } catch (err) {
    console.error('payphone-confirm error:', String(err));
    return json(500, { success: false, message: 'Error al confirmar con PayPhone.' });
  }
};

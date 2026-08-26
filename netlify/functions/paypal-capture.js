// Crea y captura órdenes de PayPal del lado del servidor (Orders v2 API).
// El cliente nunca ve el Client Secret; todo pasa por aquí.
//
// Documentación: https://developer.paypal.com/api/orders/v2/

const WEB3FORMS_KEY = '2d27232a-9864-4e50-bf55-01077f13254d';

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

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Credenciales de PayPal no configuradas en Netlify.' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Body inválido.' }) };
  }

  try {
    const accessToken = await getAccessToken();

    // ─── Crear orden ───
    if (payload.action === 'create') {
      const amount = Number(payload.amount);
      if (!amount || amount <= 0) {
        return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Monto inválido.' }) };
      }

      const res = await fetch(`${apiBase()}/v2/checkout/orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              description: payload.description || 'Firma Electrónica — DEVCORP S.A.S.',
              amount: { currency_code: 'USD', value: amount.toFixed(2) },
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { statusCode: 500, body: JSON.stringify({ success: false, message: 'No se pudo crear la orden.', data }) };
      }
      return { statusCode: 200, body: JSON.stringify({ id: data.id }) };
    }

    // ─── Capturar orden ───
    if (payload.action === 'capture') {
      const { orderID, customer } = payload;
      if (!orderID) {
        return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Falta orderID.' }) };
      }

      const res = await fetch(`${apiBase()}/v2/checkout/orders/${orderID}/capture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      const capture = data?.purchase_units?.[0]?.payments?.captures?.[0];
      if (!res.ok || data.status !== 'COMPLETED' || !capture) {
        return { statusCode: 200, body: JSON.stringify({ success: false, message: 'El pago no fue completado.', data }) };
      }

      // Pago verificado: notificar a DEVCORP por correo (Web3Forms).
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Pago recibido (PayPal) — Firma Electrónica — ${customer?.nombre || 'Cliente'}`,
          from_name: 'Sitio Web DEVCORP — Pagos',
          'Nombre': customer?.nombre || '—',
          'Cédula': customer?.cedula || '—',
          'Correo': customer?.correo || '—',
          'Teléfono': customer?.telefono || '—',
          'Vigencia comprada': customer?.vigencia || '—',
          'Monto': `$${capture.amount.value}`,
          'Método de pago': 'PayPal',
          'ID de transacción': capture.id,
        }),
      });

      return { statusCode: 200, body: JSON.stringify({ success: true, transactionId: capture.id, amount: capture.amount.value }) };
    }

    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Acción no reconocida.' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Error al procesar con PayPal.', error: String(err) }) };
  }
};

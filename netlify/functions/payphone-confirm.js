// Verifica del lado del servidor una transacción de PayPhone (Cajita de Pagos).
// Nunca confía en el resultado que reporta el navegador: siempre confirma
// contra la API de PayPhone usando el token secreto (variable de entorno).
//
// Documentación: https://docs.payphone.app/cajita-de-pagos

const WEB3FORMS_KEY = '2d27232a-9864-4e50-bf55-01077f13254d';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.PAYPHONE_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'PAYPHONE_TOKEN no configurado en Netlify.' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Body inválido.' }) };
  }

  const { id, clientTxId, customer } = payload;
  if (!id || !clientTxId) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Faltan id o clientTxId.' }) };
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
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: 'El pago no fue aprobado.', data }),
      };
    }

    // Pago verificado: notificar a DEVCORP por correo (Web3Forms).
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Pago recibido (PayPhone) — Firma Electrónica — ${customer?.nombre || 'Cliente'}`,
        from_name: 'Sitio Web DEVCORP — Pagos',
        'Nombre': customer?.nombre || '—',
        'Cédula': customer?.cedula || '—',
        'Correo': customer?.correo || '—',
        'Teléfono': customer?.telefono || '—',
        'Vigencia comprada': customer?.vigencia || '—',
        'Monto': `$${(data.amount / 100).toFixed(2)}`,
        'Método de pago': 'PayPhone',
        'ID de transacción': data.transactionId,
        'Código de autorización': data.authorizationCode,
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        transactionId: data.transactionId,
        amount: data.amount,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error al confirmar con PayPhone.', error: String(err) }),
    };
  }
};

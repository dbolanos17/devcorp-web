// Confirmación de pago por correo al CLIENTE (transaccional).
//
// Es opcional y compatible con dos proveedores (a elección, por variable de entorno):
//   - Resend  → EMAIL_PROVIDER=resend  · https://resend.com
//   - Brevo   → EMAIL_PROVIDER=brevo   · https://www.brevo.com
//
// Variables de entorno en Netlify (Site configuration → Environment variables):
//   EMAIL_PROVIDER   "resend" o "brevo"
//   EMAIL_API_KEY    clave de API del proveedor (secreta; nunca en el código)
//   EMAIL_FROM       remitente, p. ej. info@devcorp-ec.com (debe estar verificado en el proveedor)
//   EMAIL_FROM_NAME  (opcional) nombre visible; por defecto "DEVCORP S.A.S."
//   EMAIL_REPLY_TO   (opcional) a dónde llegan las respuestas; por defecto EMAIL_FROM
//
// Si falta cualquiera de las tres primeras, NO se envía nada y el pago sigue
// funcionando igual (el cliente ve su comprobante en pantalla y DEVCORP recibe
// su aviso por Web3Forms).

const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[^\s@<>"']{2,}$/;

const SITE_EMAIL = 'info@devcorp-ec.com';
const SITE_PHONE = '+593 098 720 9371';

/** Escapa texto para insertarlo en HTML. */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Arma asunto, HTML y texto plano de la confirmación de pago de la firma electrónica. */
export function buildPaymentEmail({ nombre, vigencia, monto, metodo, codigo, review }) {
  const saludo = nombre ? `Hola ${nombre},` : 'Hola,';
  const subject = review
    ? 'Recibimos tu pago y lo estamos verificando — DEVCORP'
    : 'Recibimos tu pago — Firma electrónica DEVCORP';

  const intro = review
    ? 'Recibimos tu pago. Nuestro equipo debe verificar unos datos antes de continuar y te contactará en breve.'
    : 'Recibimos tu pago de la firma electrónica. Gracias por confiar en DEVCORP.';
  const pasos = review
    ? 'Un asesor revisará tu pago y te contactará a este correo o a tu teléfono.'
    : 'Nuestro equipo validará tu información y te contactará a este correo o a tu teléfono para completar la emisión de tu firma. Si aún no nos enviaste tus documentos (cédula y, si aplica, RUC), te los pediremos en ese contacto.';

  const filas = [
    ['Servicio', 'Firma electrónica'],
    ['Vigencia', vigencia || '—'],
    ['Monto pagado', monto ? `$${monto}` : '—'],
    ['Método de pago', metodo || '—'],
    ['Código de transacción', codigo || '—'],
  ];

  const text = [
    saludo,
    '',
    intro,
    '',
    ...filas.map(([k, v]) => `${k}: ${v}`),
    '',
    pasos,
    '',
    `Conserva este correo como comprobante. Si tienes dudas, escríbenos a ${SITE_EMAIL} o al ${SITE_PHONE}.`,
    'Si no realizaste esta compra, avísanos de inmediato a ese correo.',
    '',
    'DEVCORP S.A.S. — Tu área contable, tributaria y financiera externa',
  ].join('\n');

  const html = `<!doctype html>
<html lang="es"><body style="margin:0;background:#f8f7fc;font-family:Arial,Helvetica,sans-serif;color:#1a1a2e;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:#232526;color:#ffffff;padding:18px 24px;border-radius:12px 12px 0 0;font-size:20px;font-weight:bold;letter-spacing:.04em;">DEVCORP</div>
    <div style="background:#ffffff;padding:28px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e3ef;border-top:0;">
      <p style="margin:0 0 14px;font-size:16px;">${esc(saludo)}</p>
      <p style="margin:0 0 20px;line-height:1.6;">${esc(intro)}</p>
      <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 20px;font-size:14px;">
        ${filas
          .map(
            ([k, v]) =>
              `<tr><td style="padding:9px 12px;border-bottom:1px solid #e5e3ef;color:#5b6270;width:42%;">${esc(k)}</td><td style="padding:9px 12px;border-bottom:1px solid #e5e3ef;font-weight:bold;word-break:break-all;">${esc(v)}</td></tr>`
          )
          .join('')}
      </table>
      <p style="margin:0 0 18px;line-height:1.6;">${esc(pasos)}</p>
      <p style="margin:0 0 6px;line-height:1.6;font-size:13px;color:#5b6270;">Conserva este correo como comprobante. Si tienes dudas, escríbenos a <a href="mailto:${SITE_EMAIL}" style="color:#3871c1;">${SITE_EMAIL}</a> o al ${SITE_PHONE}. Si no realizaste esta compra, avísanos de inmediato.</p>
    </div>
    <p style="text-align:center;font-size:12px;color:#5b6270;margin:16px 0 0;">DEVCORP S.A.S. — Tu área contable, tributaria y financiera externa</p>
  </div>
</body></html>`;

  return { subject, html, text };
}

/**
 * Envía un correo transaccional con el proveedor configurado.
 * Nunca lanza. Devuelve { sent: boolean, reason?: string }.
 */
export async function sendCustomerEmail({ to, subject, html, text }) {
  const provider = String(process.env.EMAIL_PROVIDER || '').toLowerCase();
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!provider || !apiKey || !from) return { sent: false, reason: 'proveedor de correo no configurado' };
  if (!to || !EMAIL_RE.test(String(to).trim())) return { sent: false, reason: 'correo del cliente inválido o ausente' };

  const address = String(to).trim();
  const fromName = process.env.EMAIL_FROM_NAME || 'DEVCORP S.A.S.';
  const replyTo = process.env.EMAIL_REPLY_TO || from;

  try {
    let res;
    if (provider === 'resend') {
      res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `${fromName} <${from}>`, to: [address], subject, html, text, reply_to: replyTo }),
      });
    } else if (provider === 'brevo') {
      res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          sender: { name: fromName, email: from },
          to: [{ email: address }],
          subject,
          htmlContent: html,
          textContent: text,
          replyTo: { email: replyTo },
        }),
      });
    } else {
      console.error('EMAIL_PROVIDER desconocido (usa "resend" o "brevo"):', provider);
      return { sent: false, reason: 'EMAIL_PROVIDER desconocido' };
    }

    if (!res.ok) {
      const detalle = (await res.text().catch(() => '')).slice(0, 300);
      console.error(`El proveedor de correo (${provider}) rechazó el envío:`, res.status, detalle);
      return { sent: false, reason: `el proveedor respondió ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error('No se pudo enviar la confirmación por correo:', String(err));
    return { sent: false, reason: 'error de red con el proveedor de correo' };
  }
}

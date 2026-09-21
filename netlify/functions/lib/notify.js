// Utilidades compartidas por las Netlify Functions de pago (módulo ESM).
//
// La clave de Web3Forms es pública por diseño (también está en el navegador).
// Puede sobrescribirse con la variable de entorno WEB3FORMS_KEY.

const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY || '2d27232a-9864-4e50-bf55-01077f13254d';

/** Limpia y acota un valor que viene del navegador antes de ponerlo en un correo. */
export function clean(value, max = 200) {
  if (value === undefined || value === null || value === '') return '—';
  return String(value).replace(/[\r\n]+/g, ' ').slice(0, max);
}

/**
 * Envía una notificación por correo a DEVCORP (vía Web3Forms).
 * Nunca lanza: si falla, deja el error en los logs de Netlify y devuelve false,
 * para no romper la respuesta al cliente cuando el pago ya fue cobrado.
 */
export async function notify(subject, fields) {
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject,
        from_name: 'Sitio Web DEVCORP — Pagos',
        ...fields,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      console.error('Web3Forms no aceptó la notificación de pago:', res.status, JSON.stringify(data));
      return false;
    }
    return true;
  } catch (err) {
    console.error('No se pudo enviar la notificación de pago:', String(err));
    return false;
  }
}


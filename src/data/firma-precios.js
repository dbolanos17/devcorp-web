// Tarifas de la firma electrónica — FUENTE ÚNICA DE VERDAD.
//
// La usan la página /servicios/firmas-electronicas/ (tabla y selector) y las
// Netlify Functions de pago (paypal-capture, payphone-confirm). Estas últimas
// validan el monto contra esta tabla en el servidor: nunca se debe confiar en
// el monto que envía el navegador.
//
// Es JavaScript plano (no TypeScript) para poder importarse desde las functions.

export const FIRMA_PRECIOS = [
  { years: 1, label: '1 año', price: 18.5 },
  { years: 2, label: '2 años', price: 32.5 },
  { years: 3, label: '3 años', price: 44.99 },
  { years: 4, label: '4 años', price: 54.99 },
  { years: 5, label: '5 años', price: 64.99 },
];

/** Devuelve la tarifa de una vigencia (1–5 años) o undefined si no existe. */
export function firmaPorAnios(years) {
  const n = Number(years);
  return FIRMA_PRECIOS.find((p) => p.years === n);
}

/** Precio en formato "$18.50". */
export function firmaPrecioTexto(p) {
  return `$${p.price.toFixed(2)}`;
}

/** Monto en centavos (formato de PayPhone). */
export function firmaCentavos(p) {
  return Math.round(p.price * 100);
}

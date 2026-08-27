/**
 * Capa de eventos de analytics, desacoplada del proveedor.
 *
 * Hoy el sitio NO tiene Google Analytics, GTM ni Meta Pixel instalados
 * (se verificó en el código — no se agrega ninguno aquí para no instalar
 * herramientas nuevas sin necesidad). Esta función es un "no-op" seguro:
 * si en el futuro se agrega GTM (dataLayer) o gtag, estos eventos empiezan
 * a fluir automáticamente sin tocar el resto del código.
 */
export const EVENTS = {
  CLICK_DIAGNOSTICO: 'click_diagnostico',
  CLICK_WHATSAPP: 'click_whatsapp',
  VIEW_PLANES: 'view_planes',
  CLICK_CONTROL: 'click_control',
  CLICK_360: 'click_360',
  CLICK_CFO: 'click_cfo',
  START_DIAGNOSTICO: 'start_diagnostico',
  SUBMIT_DIAGNOSTICO: 'submit_diagnostico',
  CLICK_FIRMA_ELECTRONICA: 'click_firma_electronica',
  CLICK_NOTAS_CREDITO: 'click_notas_credito',
  CLICK_CONSTITUCION_SAS: 'click_constitucion_sas',
} as const;

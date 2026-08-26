export const SITE = {
  name: 'DEVCORP S.A.S.',
  tagline: 'Asesores Financieros',
  title: 'DEVCORP S.A.S. — Asesores Financieros, Contables y Tributarios en Ecuador',
  description:
    'Asesoría financiera, contable, tributaria y laboral a la medida de tu negocio. Más de una década ayudando a empresas, personas naturales y ONGs en Ecuador.',
  url: 'https://devcorp-ec.com',
  phone: '+593 098 720 9371',
  phoneHref: 'tel:+593987209371',
  whatsappNumber: '593987209371',
  whatsapp: 'https://wa.me/593987209371',
  whatsappGreeting:
    'https://wa.me/593987209371?text=' +
    encodeURIComponent('Hola, me interesa una asesoría gratuita con DEVCORP'),
  email: 'info@devcorp-ec.com',
  web3formsKey: '2d27232a-9864-4e50-bf55-01077f13254d',
  // Pagos en línea (Firmas Electrónicas). Estos valores son públicos por diseño
  // de cada proveedor (van en el JavaScript del navegador) — las credenciales
  // realmente secretas (PAYPHONE_TOKEN de confirmación, PAYPAL_CLIENT_SECRET)
  // viven solo como variables de entorno en Netlify, nunca aquí.
  payphone: {
    // Mismo token que usas para confirmar transacciones. PayPhone diseña su
    // "Cajita de Pagos" para que este valor se use también en el navegador —
    // es su arquitectura oficial, no un descuido nuestro.
    token: 'REEMPLAZAR_CON_TU_PAYPHONE_TOKEN',
    storeId: 'REEMPLAZAR_CON_TU_PAYPHONE_STORE_ID',
  },
  paypalClientId: 'REEMPLAZAR_CON_TU_PAYPAL_CLIENT_ID',
  city: 'Quito, Ecuador',
  hours: 'Lunes a viernes · 9:00 – 18:00',
  social: {
    facebook: 'https://www.facebook.com/154936657697272',
    instagram: 'https://www.instagram.com/david_bolanos_devcorp',
    linkedin: 'https://www.linkedin.com/company/devcorp-sas/',
  },
};

export interface Service {
  slug: string;
  icon: string;
  title: string;
  navSub: string;
  short: string;
  items: string[];
}

export const SERVICES: Service[] = [
  {
    slug: 'asesoria-financiera',
    icon: '💰',
    title: 'Asesoría Financiera',
    navSub: 'Planificación y análisis',
    short: 'Planificación presupuestaria y análisis financiero para una gestión empresarial sólida.',
    items: ['Planificación presupuestaria', 'Análisis financiero', 'Flujo de caja', 'Indicadores de gestión'],
  },
  {
    slug: 'asesoria-contable',
    icon: '📊',
    title: 'Asesoría Contable',
    navSub: 'Contabilidad general y costos',
    short: 'Contabilidad general, gestión de inventarios y costos, con reportes confiables.',
    items: ['Contabilidad general', 'Costos e inventarios', 'Estados financieros', 'Reportes gerenciales'],
  },
  {
    slug: 'asesoria-tributaria',
    icon: '🧾',
    title: 'Asesoría Tributaria',
    navSub: 'Obligaciones y gestión SRI',
    short: 'Cumplimiento de obligaciones impositivas y eficiencia tributaria para tu empresa.',
    items: ['Declaraciones SRI', 'Planificación tributaria', 'Auditoría tributaria', 'Atención a requerimientos'],
  },
  {
    slug: 'asesoria-laboral-empresarial',
    icon: '👥',
    title: 'Asesoría Laboral & Empresarial',
    navSub: 'IESS, Min. Trabajo y gestión',
    short: 'Gestión del talento humano, IESS, Min. de Trabajo y seguridad ocupacional.',
    items: ['Nómina e IESS', 'Min. de Trabajo', 'Contratos laborales', 'Seguridad ocupacional'],
  },
  {
    slug: 'notas-de-credito-sri',
    icon: '💳',
    title: 'Notas de Crédito SRI',
    navSub: 'Conviértelas en liquidez',
    short: 'Convierte tus notas de crédito del SRI en liquidez inmediata, de forma legal.',
    items: ['Liquidez inmediata', 'Proceso legal', 'Evaluación gratuita', 'Pago en días'],
  },
  {
    slug: 'firmas-electronicas',
    icon: '✍️',
    title: 'Firmas Electrónicas',
    navSub: 'Emisión en minutos',
    short: 'Emisión de firmas electrónicas en minutos, para personas naturales o jurídicas.',
    items: ['Persona natural', 'Persona jurídica', 'Vigencia 1 a 5 años', 'Entrega en minutos'],
  },
];

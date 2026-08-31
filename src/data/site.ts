export const SITE = {
  name: 'DEVCORP S.A.S.',
  tagline: 'Tu área contable, tributaria y financiera externa',
  title: 'DEVCORP | Outsourcing Contable y CFO para PYMEs en Ecuador',
  description:
    'Outsourcing contable, tributario, laboral y CFO externo para PYMEs en Ecuador. Controla tus impuestos, flujo de caja y rentabilidad con DEVCORP.',
  url: 'https://devcorp-ec.com',
  phone: '+593 098 720 9371',
  phoneHref: 'tel:+593987209371',
  whatsappNumber: '593987209371',
  email: 'info@devcorp-ec.com',
  web3formsKey: '2d27232a-9864-4e50-bf55-01077f13254d',
  coverage: 'Atención remota en todo Ecuador',
  hours: 'Lunes a viernes · 9:00 – 18:00',
  // Pagos en línea (Firmas Electrónicas). Estos valores son públicos por diseño
  // de cada proveedor (van en el JavaScript del navegador) — las credenciales
  // realmente secretas (PAYPHONE_TOKEN de confirmación, PAYPAL_CLIENT_SECRET)
  // viven solo como variables de entorno en Netlify, nunca aquí.
  payphone: {
    token: 'zlD80MrhA6G2VAB8CnekJEpO7Uv_QdtQPzVKuLLX35Ftw3bEzPoXOLVapdA2VZEsR1zjICBkbfmPKcooYZBKz4xy-hD8eLgqt7Tsx-TT4Nm0bGjajpjfiOCHW76ifrNJuCv2gajsJx-p400kWQBgIYdmbE1w0ipM4hJNX_mBc4DjabwLTsYrxh1W3QTBFo4k2Qn09MURz0yJ0BfhoXXl6pjkZ8E5wtwn_CfxRdIjcwDQaXuX1Wv52p2TaDzxRCxnfGtyWgccJ_1UZWljX7S1Zakfl5uTqSR5R4Q9neSEytMEbHy8NjtzJq_vz4-sB65WA3psA4rJtxG0BT9Yo4UtQs1ptwE',
    // storeId NO se envía a PPaymentButtonBox (es opcional y con una sola tienda
    // asociada al Token causaba "La tienda asociada no existe" — Error 100).
    // Se deja aquí solo como referencia.
    storeId: '1793200375001',
  },
  // Client ID de PayPal LIVE (cuenta Business verificada) — pagos reales.
  paypalClientId: 'BAAaj5Vh3oBX7vlw1OaZVCZOz_rV7OLUe9bET2i_HMFYMcYhzPeVm_5F2YeM-xZvcpzfpvAsbcY5MUzK2c',
  social: {
    facebook: 'https://www.facebook.com/154936657697272',
    instagram: 'https://www.instagram.com/david_bolanos_devcorp',
    linkedin: 'https://www.linkedin.com/company/devcorp-sas/',
  },
};

/** Construye un enlace de WhatsApp con mensaje prellenado según el contexto. */
export function waLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WA_MESSAGES = {
  diagnostico: 'Hola DEVCORP. Quiero solicitar un Diagnóstico Empresarial 360 para mi empresa.',
  plan360: 'Hola DEVCORP. Quiero conocer si el plan DEVCORP 360 es adecuado para mi empresa.',
  cfo: 'Hola DEVCORP. Quiero evaluar el servicio de CFO externo.',
  control: 'Hola DEVCORP. Quiero conocer el plan DEVCORP Control para mi empresa.',
  enterprise: 'Hola DEVCORP. Quiero solicitar una evaluación para una operación compleja o multiempresa.',
  notasCredito: 'Hola DEVCORP. Quiero evaluar mi caso de notas de crédito o devolución tributaria.',
  firmas: 'Hola DEVCORP. Quiero información sobre la firma electrónica.',
  constitucion: 'Hola DEVCORP. Quiero constituir una S.A.S. con RUC y firma electrónica.',
  general: 'Hola DEVCORP. Quiero información sobre sus servicios.',
};

/* ─────────────────────────────────────────────
   PLANES RECURRENTES
   Precios siempre mostrados como "+ IVA".
   ───────────────────────────────────────────── */

export interface Plan {
  slug: string;
  name: string;
  price: number;
  priceLabel: string;
  from: boolean;
  audience: string;
  pitch: string;
  featured?: boolean;
  highlights: string[];
  limits: { label: string; value: string }[];
  cta: { label: string; href: string };
  note?: string;
}

export const PLANS: Plan[] = [
  {
    slug: 'cumple',
    name: 'DEVCORP Cumple',
    price: 89,
    priceLabel: '$89',
    from: false,
    audience: 'S.A.S. nueva o empresa de muy baja actividad',
    pitch:
      'Cumplimiento contable y tributario ordenado para empresas que recién inician o mantienen baja actividad.',
    highlights: [
      'Contabilidad mensual',
      'IVA y retenciones cuando correspondan',
      'ATS e Impuesto a la Renta anual',
      'Cumplimiento societario ordinario',
      'Conciliación y estados financieros básicos',
      'Revisión tributaria preventiva anual',
    ],
    limits: [
      { label: 'Transacciones mensuales', value: 'Hasta 50' },
      { label: 'Empleados', value: '0 – 1' },
      { label: 'Cuentas bancarias', value: '1' },
      { label: 'Establecimientos', value: '1' },
      { label: 'Novedades laborales ordinarias', value: '1 al mes' },
    ],
    cta: { label: 'Solicitar diagnóstico', href: '/diagnostico/' },
  },
  {
    slug: 'control',
    name: 'DEVCORP Control',
    price: 249,
    priceLabel: '$249',
    from: true,
    audience: 'Microempresa formal en operación',
    pitch:
      'Cumplimiento y gestión contable para empresas que quieren delegar la operación administrativa.',
    highlights: [
      'Contabilidad mensual y conciliaciones',
      'IVA, retenciones, ATS e IR anual',
      'Nómina, IESS y Ministerio del Trabajo',
      'Resumen de cuentas por cobrar y por pagar',
      'Dashboard financiero básico',
      'Planificación tributaria básica',
      'Reunión mensual de 30 minutos',
    ],
    limits: [
      { label: 'Transacciones mensuales', value: 'Hasta 150' },
      { label: 'Empleados', value: 'Hasta 3' },
      { label: 'Cuentas bancarias', value: '2' },
      { label: 'Establecimientos', value: '1' },
      { label: 'Novedades laborales ordinarias', value: '2 al mes' },
    ],
    cta: { label: 'Conocer Control', href: '/outsourcing-contable/' },
    note: 'SLA aproximado de 36 horas laborables.',
  },
  {
    slug: '360',
    name: 'DEVCORP 360',
    price: 499,
    priceLabel: '$499',
    from: true,
    audience: 'PYME en crecimiento',
    pitch:
      'Contabilidad, impuestos, nómina y control financiero en una sola solución.',
    featured: true,
    highlights: [
      'Todo lo incluido en Control',
      'Cierre contable mensual completo',
      'Balance, resultados y flujo de efectivo',
      'Control de cartera, CxC y CxP',
      'Presupuesto y comparativo real vs. presupuesto',
      'KPIs financieros y análisis de rentabilidad',
      'Informe «5 cosas + 3 decisiones» cada mes',
      'Reunión gerencial mensual de 60 minutos',
    ],
    limits: [
      { label: 'Transacciones mensuales', value: 'Hasta 300' },
      { label: 'Empleados', value: 'Hasta 10' },
      { label: 'Cuentas bancarias', value: '3' },
      { label: 'Establecimientos', value: '2' },
      { label: 'Novedades laborales ordinarias', value: '5 al mes' },
    ],
    cta: { label: 'Solicitar diagnóstico', href: '/diagnostico/' },
  },
  {
    slug: 'cfo-advisory',
    name: 'DEVCORP CFO Advisory',
    price: 790,
    priceLabel: '$790',
    from: true,
    audience: 'Empresa que ya tiene contador y necesita dirección financiera',
    pitch:
      'Dirección financiera para empresarios que necesitan entender sus números y tomar mejores decisiones.',
    highlights: [
      'Revisión financiera y dashboard ejecutivo',
      'Flujo de caja proyectado a 13 semanas',
      'Presupuesto, forecast y real vs. presupuesto',
      'KPIs, rentabilidad, márgenes y capital de trabajo',
      'Escenarios financieros y análisis gerencial',
      'Reunión financiera y reporte ejecutivo',
    ],
    limits: [
      { label: 'Procesamiento contable', value: 'No incluido' },
      { label: 'Declaraciones y ATS', value: 'No incluido' },
      { label: 'Nómina y operación laboral', value: 'No incluido' },
      { label: 'Insumo requerido', value: 'Información cerrada y conciliada' },
    ],
    cta: { label: 'Evaluar mi empresa', href: '/cfo-externo/' },
    note:
      'No incluye procesamiento contable, tributario ni laboral. Su insumo es información financiera previamente procesada y conciliada por el cliente o su contador.',
  },
  {
    slug: 'cfo-integral',
    name: 'DEVCORP CFO Integral',
    price: 1190,
    priceLabel: '$1.190',
    from: false,
    audience: 'Empresa que necesita dirección financiera y outsourcing operativo',
    pitch:
      'Una función financiera externa para la gerencia, sobre la operación contable completa.',
    highlights: [
      'Todo lo incluido en DEVCORP 360',
      'CFO externo asignado',
      'Forecast de caja de 13 semanas y presupuesto anual',
      'Análisis de rentabilidad, márgenes y capital de trabajo',
      'Escenarios financieros e indicadores ejecutivos',
      'Planificación tributaria estratégica',
      'Apoyo en decisiones de inversión y financiamiento',
      'Reporte ejecutivo mensual de una hoja · dos reuniones al mes',
    ],
    limits: [
      { label: 'Transacciones mensuales', value: 'Hasta 600' },
      { label: 'Empleados', value: 'Hasta 20' },
      { label: 'Cuentas bancarias', value: 'Hasta 5' },
      { label: 'Establecimientos', value: 'Hasta 3' },
      { label: 'Novedades laborales ordinarias', value: 'Hasta 10 al mes' },
    ],
    cta: { label: 'Evaluar mi empresa', href: '/cfo-externo/' },
    note: 'Acompañamiento prioritario.',
  },
  {
    slug: 'enterprise',
    name: 'DEVCORP Enterprise',
    price: 1690,
    priceLabel: '$1.690',
    from: true,
    audience: 'Operaciones complejas, multiempresa o con necesidades especiales',
    pitch:
      'Para operaciones complejas, multiempresa o con necesidades especiales. Alcance, equipo y honorarios definidos mediante diagnóstico.',
    highlights: [
      'Alcance definido mediante diagnóstico',
      'Equipo asignado según la operación',
      'Estructura multiempresa o multiestablecimiento',
      'Acompañamiento a la medida',
    ],
    limits: [{ label: 'Alcance', value: 'Definido mediante diagnóstico' }],
    cta: { label: 'Solicitar evaluación', href: '/diagnostico/' },
  },
];

export const HOME_PLAN_SLUGS = ['control', '360', 'cfo-advisory'];

/* ─────────────────────────────────────────────
   COMPARATIVO DE PLANES
   ───────────────────────────────────────────── */

export const COMPARISON_ROWS: { feature: string; values: Record<string, string> }[] = [
  {
    feature: 'Contabilidad mensual',
    values: { cumple: 'Sí', control: 'Sí', '360': 'Sí', 'cfo-advisory': 'No', 'cfo-integral': 'Sí' },
  },
  {
    feature: 'IVA, retenciones y ATS',
    values: { cumple: 'Sí', control: 'Sí', '360': 'Sí', 'cfo-advisory': 'No', 'cfo-integral': 'Sí' },
  },
  {
    feature: 'Impuesto a la Renta anual',
    values: { cumple: 'Sí', control: 'Sí', '360': 'Sí', 'cfo-advisory': 'No', 'cfo-integral': 'Sí' },
  },
  {
    feature: 'Cumplimiento societario ordinario',
    values: { cumple: 'Sí', control: 'Sí', '360': 'Sí', 'cfo-advisory': 'No', 'cfo-integral': 'Sí' },
  },
  {
    feature: 'Transacciones mensuales incluidas',
    values: { cumple: '50', control: '150', '360': '300', 'cfo-advisory': '—', 'cfo-integral': '600' },
  },
  {
    feature: 'Cuentas bancarias incluidas',
    values: { cumple: '1', control: '2', '360': '3', 'cfo-advisory': '—', 'cfo-integral': '5' },
  },
  {
    feature: 'Empleados en nómina',
    values: { cumple: '0 – 1', control: 'Hasta 3', '360': 'Hasta 10', 'cfo-advisory': '—', 'cfo-integral': 'Hasta 20' },
  },
  {
    feature: 'IESS y Ministerio del Trabajo',
    values: { cumple: 'Básico', control: 'Sí', '360': 'Sí', 'cfo-advisory': 'No', 'cfo-integral': 'Sí' },
  },
  {
    feature: 'Cuentas por cobrar y por pagar',
    values: { cumple: 'No', control: 'Resumen', '360': 'Sí', 'cfo-advisory': 'Análisis', 'cfo-integral': 'Sí' },
  },
  {
    feature: 'Dashboard financiero',
    values: { cumple: 'No', control: 'Básico', '360': 'Gerencial', 'cfo-advisory': 'Ejecutivo', 'cfo-integral': 'Ejecutivo' },
  },
  {
    feature: 'Presupuesto',
    values: { cumple: 'No', control: 'No', '360': 'Básico', 'cfo-advisory': 'Sí', 'cfo-integral': 'Anual' },
  },
  {
    feature: 'Flujo de caja proyectado',
    values: { cumple: 'No', control: 'No', '360': 'Mensual', 'cfo-advisory': '13 semanas', 'cfo-integral': '13 semanas' },
  },
  {
    feature: 'Planificación tributaria',
    values: { cumple: 'Anual preventiva', control: 'Básica', '360': 'Trimestral', 'cfo-advisory': 'No', 'cfo-integral': 'Estratégica' },
  },
  {
    feature: 'KPIs financieros',
    values: { cumple: 'No', control: 'No', '360': 'Sí', 'cfo-advisory': 'Sí', 'cfo-integral': 'Ejecutivos' },
  },
  {
    feature: 'Análisis de rentabilidad y márgenes',
    values: { cumple: 'No', control: 'No', '360': 'Básico', 'cfo-advisory': 'Sí', 'cfo-integral': 'Sí' },
  },
  {
    feature: 'Escenarios financieros',
    values: { cumple: 'No', control: 'No', '360': 'No', 'cfo-advisory': 'Sí', 'cfo-integral': 'Sí' },
  },
  {
    feature: 'Informe «5 cosas + 3 decisiones»',
    values: { cumple: 'No', control: 'No', '360': 'Sí', 'cfo-advisory': 'Sí', 'cfo-integral': 'Sí' },
  },
  {
    feature: 'Reporte ejecutivo mensual',
    values: { cumple: 'No', control: 'No', '360': 'Sí', 'cfo-advisory': 'Sí', 'cfo-integral': 'Una hoja' },
  },
  {
    feature: 'Reuniones incluidas',
    values: { cumple: 'A solicitud', control: '30 min / mes', '360': '60 min / mes', 'cfo-advisory': 'Reunión financiera', 'cfo-integral': '2 al mes' },
  },
  {
    feature: 'SLA de respuesta',
    values: { cumple: 'Estándar', control: '≈36 h laborables', '360': '≈36 h laborables', 'cfo-advisory': 'Prioritario', 'cfo-integral': 'Prioritario' },
  },
];

/** Recargos por exceder los límites incluidos en cada plan. */
export const OVERAGES = [
  { label: 'Bloque adicional de 50 transacciones', price: '$40 + IVA' },
  { label: 'Empleado adicional', price: '$10 + IVA' },
  { label: 'Cuenta bancaria o tarjeta adicional', price: '$20 + IVA' },
  { label: 'Establecimiento adicional', price: 'Desde $30 + IVA' },
  { label: 'Novedad laboral ordinaria adicional', price: '$12 + IVA' },
];

/* ─────────────────────────────────────────────
   SERVICIOS ESPECIALIZADOS
   Se cotizan aparte de los planes recurrentes.
   ───────────────────────────────────────────── */

export interface Service {
  slug: string;
  icon: string;
  title: string;
  navSub: string;
  short: string;
  items: string[];
  category: 'Tributarios' | 'Societarios' | 'Laborales' | 'Financieros' | 'Trámites';
  href?: string;
}

export const SPECIALIZED_SERVICES: Service[] = [
  {
    slug: 'notas-de-credito-sri',
    icon: '💳',
    title: 'Notas de crédito y devoluciones',
    navSub: 'Conviértelas en liquidez',
    short:
      'Negociamos tus notas de crédito del SRI y gestionamos devoluciones tributarias, con honorario de éxito.',
    items: ['Evaluación del caso', 'Proceso legal', 'Honorario de éxito'],
    category: 'Tributarios',
  },
  {
    slug: 'firmas-electronicas',
    icon: '✍️',
    title: 'Firma electrónica',
    navSub: 'Emisión en minutos',
    short: 'Emisión de firmas electrónicas para personas naturales o jurídicas, con validez legal en Ecuador.',
    items: ['Persona natural', 'Persona jurídica', 'Vigencia 1 a 5 años'],
    category: 'Trámites',
  },
  {
    slug: 'constitucion-sas',
    icon: '🏛️',
    title: 'Constitución de S.A.S.',
    navSub: 'Constitución + RUC + firma',
    short: 'Constituimos tu S.A.S. e incluimos RUC y firma electrónica por $199 + IVA.',
    items: ['Constitución', 'RUC', 'Firma electrónica'],
    category: 'Societarios',
  },
  {
    slug: 'asesoria-tributaria',
    icon: '🧾',
    title: 'Requerimientos y regularizaciones SRI',
    navSub: 'Atención a la administración',
    short:
      'Atendemos requerimientos, determinaciones y procesos de regularización ante el Servicio de Rentas Internas.',
    items: ['Requerimientos', 'Determinaciones', 'Regularizaciones'],
    category: 'Tributarios',
  },
  {
    slug: 'asesoria-laboral-empresarial',
    icon: '👥',
    title: 'Servicios laborales especializados',
    navSub: 'ICT, reglamentos y actuaciones',
    short:
      'Reglamento interno, informe de cumplimiento (ICT), seguridad ocupacional y actuaciones laborales complejas.',
    items: ['Reglamento interno', 'ICT', 'Seguridad ocupacional'],
    category: 'Laborales',
  },
  {
    slug: 'asesoria-financiera',
    icon: '💰',
    title: 'Consultoría financiera puntual',
    navSub: 'Proyectos específicos',
    short:
      'Proyectos financieros que no forman parte de un plan recurrente: valoración, planificación estratégica y evaluación de inversiones.',
    items: ['Valoración', 'Planificación', 'Evaluación de inversiones'],
    category: 'Financieros',
  },
  {
    slug: 'devolucion-de-impuestos',
    icon: '💵',
    title: 'Devolución de impuestos',
    navSub: 'Recupera pagos en exceso',
    short:
      'Gestionamos ante el SRI la devolución de impuestos pagados en exceso, con evaluación gratuita y honorario de éxito.',
    items: ['Evaluación del caso', 'Presentación ante el SRI', 'Honorario de éxito'],
    category: 'Tributarios',
  },
];

/** Servicios que nunca están incluidos en los planes recurrentes: se cotizan aparte. */
export const NOT_INCLUDED = [
  'Contabilidad atrasada y reconstrucción histórica',
  'Regularizaciones y depuración de saldos',
  'Informe de Cumplimiento Tributario (ICT)',
  'Requerimientos y determinaciones del SRI',
  'Peritajes y devoluciones tributarias',
  'Constitución de sociedades, reformas y liquidaciones',
  'Informe de comisario',
  'Reglamentos internos y manuales',
  'Proyectos de planificación estratégica',
  'Valoración de empresa',
  'Protección de datos personales',
  'Auditoría e implementación de software',
  'Inventarios físicos y visitas presenciales',
  'Actuaciones laborales complejas',
];

/**
 * Servicios recurrentes usados por las páginas de detalle heredadas
 * (/servicios/asesoria-*) y por la barra lateral de esas páginas.
 */
export const SERVICES: Service[] = [
  {
    slug: 'asesoria-financiera',
    icon: '💰',
    title: 'Asesoría Financiera',
    navSub: 'Planificación y análisis',
    short: 'Planificación presupuestaria y análisis financiero para una gestión empresarial sólida.',
    items: ['Planificación presupuestaria', 'Análisis financiero', 'Flujo de caja', 'Indicadores de gestión'],
    category: 'Financieros',
  },
  {
    slug: 'asesoria-contable',
    icon: '📊',
    title: 'Asesoría Contable',
    navSub: 'Contabilidad y reportes',
    short: 'Contabilidad general, control de costos y reportes confiables para decidir.',
    items: ['Contabilidad general', 'Costos', 'Estados financieros', 'Reportes gerenciales'],
    category: 'Financieros',
  },
  {
    slug: 'asesoria-tributaria',
    icon: '🧾',
    title: 'Asesoría Tributaria',
    navSub: 'Obligaciones y gestión SRI',
    short: 'Cumplimiento de obligaciones impositivas y eficiencia tributaria para tu empresa.',
    items: ['Declaraciones SRI', 'Planificación tributaria', 'Auditoría tributaria', 'Atención a requerimientos'],
    category: 'Tributarios',
  },
  {
    slug: 'asesoria-laboral-empresarial',
    icon: '👥',
    title: 'Asesoría Laboral & Empresarial',
    navSub: 'IESS, Min. Trabajo y gestión',
    short: 'Gestión del talento humano, IESS, Min. de Trabajo y seguridad ocupacional.',
    items: ['Nómina e IESS', 'Min. de Trabajo', 'Contratos laborales', 'Seguridad ocupacional'],
    category: 'Laborales',
  },
  {
    slug: 'notas-de-credito-sri',
    icon: '💳',
    title: 'Notas de Crédito SRI',
    navSub: 'Conviértelas en liquidez',
    short: 'Convierte tus notas de crédito del SRI en liquidez inmediata, de forma legal.',
    items: ['Liquidez inmediata', 'Proceso legal', 'Evaluación gratuita'],
    category: 'Tributarios',
  },
  {
    slug: 'firmas-electronicas',
    icon: '✍️',
    title: 'Firmas Electrónicas',
    navSub: 'Emisión en minutos',
    short: 'Emisión de firmas electrónicas en minutos, para personas naturales o jurídicas.',
    items: ['Persona natural', 'Persona jurídica', 'Vigencia 1 a 5 años', 'Entrega en minutos'],
    category: 'Trámites',
  },
];

/* ─────────────────────────────────────────────
   PREGUNTAS FRECUENTES
   ───────────────────────────────────────────── */

export const FAQS = [
  {
    q: '¿DEVCORP reemplaza a mi contador?',
    a: 'Depende del servicio. DEVCORP 360 y CFO Integral pueden asumir el procesamiento acordado. CFO Advisory está diseñado precisamente para empresas que ya tienen contador y necesitan dirección financiera.',
  },
  {
    q: '¿Atienden empresas fuera de Quito?',
    a: 'Sí. DEVCORP puede prestar sus servicios de forma remota en Ecuador según el alcance contratado.',
  },
  {
    q: '¿Qué información necesitan para cotizar?',
    a: 'Volumen de transacciones, empleados, cuentas bancarias, establecimientos, complejidad tributaria y nivel de acompañamiento requerido.',
  },
  {
    q: '¿Por qué los planes tienen límites?',
    a: 'Porque el honorario depende de la carga real de trabajo. Si el volumen aumenta de forma permanente, se ajusta el alcance o el plan.',
  },
  {
    q: '¿El onboarding tiene costo?',
    a: 'Con contrato mínimo de seis meses, el onboarding estándar no tiene costo. En modalidad sin permanencia corresponde aproximadamente al 50% de una mensualidad. Regularizaciones y reconstrucciones se cotizan aparte.',
  },
  {
    q: '¿Qué diferencia existe entre CFO Advisory y CFO Integral?',
    a: 'Advisory utiliza información contable procesada por el cliente o su contador y se concentra en análisis y decisiones. Integral incorpora además la gestión operativa incluida en el plan.',
  },
];

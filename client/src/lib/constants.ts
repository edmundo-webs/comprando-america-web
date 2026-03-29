// Image URLs - hosted on Cloudinary
export const IMAGES = {
  logo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438699/comprando-america/logo.png",
  hero: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438702/comprando-america/hero.webp",
  investmentBusiness: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438705/comprando-america/investmentBusiness.webp",
  realEstate: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438708/comprando-america/realEstate.webp",
  visa: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438711/comprando-america/visa.webp",
  expansion: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438714/comprando-america/expansion.webp",
};

export const EXTERNAL_LINKS = {
  membresia: "https://comprandoamerica.com/membresia/",
  formacion: "https://comprandoamerica.com/formacion/",
  visaE2: "https://comprandoamerica.com/visa-e2-inversionista-usa/",
  bienesRaices: "https://comprandoamerica.com/bienes-raices-en-usa/",
  estructura: "https://comprandoamerica.com/estructura-de-inversion-en-usa/",
  expansion: "https://comprandoamerica.com/expansion-internacional-empresas/",
  blog: "https://www.comprandoamerica.com/blog",
  podcast: "https://www.comprandoamerica.com/podcast",
  quienesSomos: "https://www.comprandoamerica.com/quienes-somos",
  edmundoTrevino: "https://edmundotrevino.com",
  mentoria: "https://edmundotrevino.com/asesoria",
  whatsapp: "https://wa.me/message/COMPRANDO",
};

export const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Comunidad", href: "/membresia" },
  { label: "Inversión", href: "#", children: [
    { label: "Oportunidades", href: "/oportunidades-de-inversion-en-estados-unidos" },
    { label: "Estructura Empresarial", href: "/estructura-de-inversion-en-usa" },
    { label: "Visa E-2", href: "/visa-e2-inversion-en-estados-unidos" },
    { label: "Bienes Raíces", href: "/bienes-raices-en-usa" },
  ]},
  { label: "Eventos", href: "/eventos" },
  { label: "Recursos", href: "/recursos", children: [
    { label: "Podcast", href: "/podcast" },
    { label: "Noticias", href: "/news" },
    { label: "Blog", href: "/blog" },
    { label: "Quiénes Somos", href: "/quienes-somos" },
  ]},
];

export const STATS = [
  { value: 4, suffix: "", label: "Proyectos exitosos en su meta de 1 MDD de ventas en un año" },
  { value: 20, suffix: "+", label: "Años operando empresas en los Estados Unidos" },
  { value: 9, suffix: "+", label: "Empresas con operaciones vigentes y en crecimiento" },
  { value: 5, suffix: "+", label: "Millones de dólares destinados en inversión directa" },
];

export const MEMBERSHIP_PILLARS = [
  {
    title: "Deal Day",
    description: "Presentamos de manera mensual oportunidades de inversión previamente filtradas por nuestro equipo de investigación.",
    icon: "calendar",
  },
  {
    title: "Deal Finding",
    description: "Herramientas y estrategias para detectar, analizar y negociar oportunidades de adquisición en Estados Unidos.",
    icon: "search",
  },
  {
    title: "Americaniza tu Operación",
    description: "Acompañamiento para adaptar tu modelo de negocio al mercado americano con éxito.",
    icon: "globe",
  },
  {
    title: "Visa a la Medida",
    description: "Asesoría personalizada para obtener la visa de inversionista que mejor se adapte a tu perfil.",
    icon: "shield",
  },
  {
    title: "Círculo Experto",
    description: "Acceso a una red de especialistas en administración, contabilidad fiscal, agentes aduanales y más.",
    icon: "users",
  },
  {
    title: "Real Estate Optimizado",
    description: "Estrategias de inversión en bienes raíces en Estados Unidos con enfoque en rentabilidad.",
    icon: "building",
  },
];

export const BLOG_POSTS = [
  {
    date: "Febrero 9, 2026",
    title: "¿Por qué sirve la diversificación?",
    excerpt: "Descubre cómo la diversificación de inversiones puede proteger y hacer crecer tu patrimonio en el mercado americano.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    url: "https://comprandoamerica.com/blog/",
  },
  {
    date: "Febrero 5, 2026",
    title: "La verdad incómoda del financiamiento del vendedor",
    excerpt: "Lo que nadie te dice sobre el financiamiento del vendedor al comprar un negocio en Estados Unidos.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
    url: "https://comprandoamerica.com/blog/",
  },
  {
    date: "Febrero 3, 2026",
    title: "Visa E-2 remodelando casas en Estados Unidos",
    excerpt: "Una alternativa real para invertir, migrar y construir patrimonio en dólares a través del real estate.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    url: "https://comprandoamerica.com/blog/",
  },
];

export const FAQ_ITEMS = [
  {
    question: "¿Qué es la comunidad Comprando América?",
    answer: "Comprando América es una comunidad privada de empresarios e inversionistas latinos que, a través de una membresía, acceden a oportunidades de inversión en negocios en Estados Unidos desde $100,000 USD. Ofrecemos acompañamiento experto, eventos presenciales, viajes de inspección y asesoría en áreas clave para crear, adquirir o escalar negocios de forma estratégica y segura.",
  },
  {
    question: "¿Cuáles son los requisitos para unirse?",
    answer: "Todas las solicitudes de ingreso son revisadas por nuestro equipo para mantener la exclusividad, valores e integridad del grupo. Se requiere capacidad de inversión mínima de $100,000 USD y un perfil empresarial o profesional alineado con los valores de la comunidad.",
  },
  {
    question: "¿Qué incluye la Comunidad?",
    answer: "La membresía incluye acceso a los 6 pilares: Deal Day, Deal Finding, Americaniza tu Operación, Visa a la Medida, Círculo Experto y Real Estate Optimizado. Además, apertura de empresa y cuentas bancarias, inversiones exclusivas, consultorías 1:1, y construcción de crédito para extranjeros.",
  },
  {
    question: "¿Quiénes están en la comunidad?",
    answer: "Empresarios e inversionistas latinos de diversos países que comparten el objetivo de invertir y crear patrimonio en Estados Unidos de forma estratégica y segura.",
  },
  {
    question: "¿Cuánto dura la membresía?",
    answer: "La membresía es vitalicia. Una vez que eres aceptado, tienes acceso permanente a todos los beneficios y recursos de la comunidad.",
  },
];

/**
 * Galería Centralizada de Fotos - Comprando América
 * 
 * Este archivo centraliza todas las fotos reales de Comprando América
 * para uso en diferentes páginas del sitio.
 * 
 * Estructura:
 * - events: Fotos de eventos, conferencias y reuniones
 * - team: Fotos de miembros del equipo
 * - experts: Fotos del equipo de expertos aliados
 * - community: Fotos de la comunidad en acción
 */

export const GALLERY = {
  events: {
    conference_edmundo: {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/oSCNKGbVTMDrZSPm.jpg",
      title: "Presentación Edmundo - Visión de Comprando América",
      description: "Edmundo presentando los objetivos y visión de Comprando América a la comunidad",
      category: "conference",
      date: "2026-03",
      alt: "Edmundo presentando en conferencia de Comprando América"
    },
    workshop_presentation: {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/SmouLTItuKIviYrf.jpg",
      title: "Workshop - Capacitación de Inversión",
      description: "Instructor explicando estrategias de inversión en pizarra interactiva",
      category: "workshop",
      date: "2026-03",
      alt: "Workshop de capacitación en Comprando América"
    },
    panel_experts_1: {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/AzJODwHDvUXqNjdV.jpg",
      title: "Panel de Expertos - Comprando América",
      description: "Panel de expertos compartiendo conocimiento con la comunidad",
      category: "panel",
      date: "2026-03",
      alt: "Panel de expertos de Comprando América"
    },
    panel_experts_2: {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/VvzYTbOPmFvtpnUx.jpg",
      title: "Panel de Expertos - Detalle",
      description: "Expertos en panel respondiendo preguntas de la comunidad",
      category: "panel",
      date: "2026-03",
      alt: "Detalle de panel de expertos"
    },
    community_gathering: {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/EJYcPnwAVlkplbyE.jpg",
      title: "Reunión de Comunidad - Evento Presencial",
      description: "Miembros de Comprando América reunidos en evento presencial",
      category: "community_event",
      date: "2026-03",
      alt: "Comunidad de Comprando América en evento presencial"
    },
    audience_engagement: {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/SxKhyhUFZfMbFlJK.jpg",
      title: "Audiencia Comprando América",
      description: "Comunidad atenta y comprometida en evento de Comprando América",
      category: "community_event",
      date: "2026-03",
      alt: "Audiencia de Comprando América en evento"
    },
    member_speaking: {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/ibSTXjKQMIuhXjVl.jpg",
      title: "Miembro Compartiendo Experiencia",
      description: "Miembro de Comprando América compartiendo su experiencia de inversión con la comunidad",
      category: "member_testimonial",
      date: "2026-03",
      alt: "Miembro hablando en evento de Comprando América"
    }
  },

  experts: {
    allied_team: {
      url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/gnumaucdsTZCWXNK.jpg",
      title: "Red de Expertos Aliados",
      description: "Equipo profesional: CPA, abogados (migración, propiedad intelectual), especialistas en real estate y derecho comercial",
      category: "professional_team",
      date: "2026-03",
      specialties: ["CPA", "Abogado Migración", "Propiedad Intelectual", "Real Estate", "Derecho Comercial"],
      alt: "Red de expertos aliados de Comprando América"
    }
  },

  team: {
    edmundo: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291837994/TXKhhi3qa3kqCbF2c9sawS/member-edmundo-natural-6GCimzhH43ZHfHpiPxchXK.webp",
      title: "Edmundo",
      role: "Fundador, Cumbres",
      description: "Fundador y líder de Comprando América",
      category: "founder",
      alt: "Edmundo - Fundador de Comprando América"
    },
    maria: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291837994/TXKhhi3qa3kqCbF2c9sawS/member-maria-natural-ntb2ZHwfmdHa9s5Twxni6n.webp",
      title: "María",
      role: "Empresaria, Real Estate",
      description: "Especialista en inversiones inmobiliarias",
      category: "team_member",
      alt: "María - Especialista en Real Estate"
    },
    carlos: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291837994/TXKhhi3qa3kqCbF2c9sawS/member-carlos-natural-FkNYZdx7EF8Tbz5XxdNzos.webp",
      title: "Carlos",
      role: "Inversionista, Startups",
      description: "Experto en inversiones de startups y tecnología",
      category: "team_member",
      alt: "Carlos - Inversionista en Startups"
    },
    alejandra: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291837994/TXKhhi3qa3kqCbF2c9sawS/member-alejandra-natural-dGMFdfBEmYRRxo6XKoABHF.webp",
      title: "Alejandra",
      role: "CEO, Tech Ventures",
      description: "Líder de iniciativas tecnológicas y emprendimientos",
      category: "team_member",
      alt: "Alejandra - CEO de Tech Ventures"
    }
  },

  community: {
    // Espacio reservado para fotos de comunidad en acción
    // Se agregarán conforme se reciban más fotos
  }
};

/**
 * Función auxiliar para obtener todas las fotos de una categoría
 */
export const getGalleryByCategory = (category: string) => {
  const allPhotos = {
    ...GALLERY.events,
    ...GALLERY.experts,
    ...GALLERY.team,
    ...GALLERY.community
  };

  return Object.values(allPhotos).filter(
    (photo: any) => photo.category === category
  );
};

/**
 * Función auxiliar para obtener una foto específica por ID
 */
export const getGalleryPhoto = (id: string) => {
  const allPhotos = {
    ...GALLERY.events,
    ...GALLERY.experts,
    ...GALLERY.team,
    ...GALLERY.community
  };

  return (allPhotos as any)[id] || null;
};

/**
 * Función auxiliar para obtener todas las fotos
 */
export const getAllGalleryPhotos = () => {
  return {
    ...GALLERY.events,
    ...GALLERY.experts,
    ...GALLERY.team,
    ...GALLERY.community
  };
};

/**
 * Función auxiliar para obtener todas las fotos de eventos
 */
export const getEventPhotos = () => {
  return Object.values(GALLERY.events);
};

/**
 * Función auxiliar para obtener todas las fotos del equipo
 */
export const getTeamPhotos = () => {
  return Object.values(GALLERY.team);
};

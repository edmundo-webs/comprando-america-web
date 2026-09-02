// El portafolio de propiedades y la sesión de miembro.
//
// Las propiedades ya no viven en este repo: se capturan en el CMS y se leen de
// su API. Antes estaban escritas a mano aquí —dos veces, y una de las copias
// era código muerto— así que publicar una exigía editar código y desplegar.
//
// El candado NO se aplica aquí. Una propiedad privada llega del servidor ya
// redactada: sus cifras nunca se serializan. Esconderlas en el navegador no las
// escondería, porque seguirían viajando en la respuesta y se leen en la pestaña
// de red. Este archivo solo dibuja lo que llegó.

const CMS_URL =
  (import.meta.env.VITE_CRM_API_URL as string | undefined) ?? "https://ca-cms.onrender.com";

const BASE = `${CMS_URL}/api/public/portafolio`;

/** Dónde se guarda la sesión de miembro en el navegador. */
const CLAVE_SESION = "ca_miembro_token";

export type Foto = {
  url: string;
  alt: string | null;
  focalPoint: string;
  fit: "cover" | "contain";
};

/** Lo que llega de una propiedad que el visitante SÍ puede ver completa. */
/** El recorrido de la propiedad. Solo `vendida` sale de la lista principal. */
export type Disponibilidad =
  | "disponible"
  | "revision_documentos"
  | "en_tramites"
  | "vendida";

export const ETIQUETA_ESTATUS: Record<Disponibilidad, string | null> = {
  disponible: null, // sin etiqueta: es el estado normal
  revision_documentos: "REVISIÓN DE DOCUMENTOS",
  en_tramites: "EN TRÁMITES",
  vendida: "VENDIDA",
};

export type PropiedadAbierta = {
  bloqueada: false;
  puedeContactar: true;
  id: number;
  slug: string;
  numeroPublico: number;
  tipo: string;
  ciudad: string;
  estado: string;
  /** Calle y número. Solo llega si hay sesión de miembro. */
  direccion?: string | null;
  zip?: string | null;
  precioInversionista: number;
  precioLista: number | null;
  moneda: string;
  recamaras: number;
  banos: number;
  sqft: number;
  anioConstruccion: number | null;
  loteSqft: number | null;
  hoaAnual: number | null;
  rentaMensual: number;
  ingresoAnual: number;
  gastosAnuales: number;
  noiAnual: number;
  /** En centésimas: 780 = 7.80 %. */
  capRate: number;
  detalles: string[];
  linkZillow: string | null;
  disponibilidad: Disponibilidad;
  esPrivada: boolean;
  fotos: Foto[];
};

/** Lo que llega cuando es privada y quien mira no es miembro. Sin cifras. */
export type PropiedadBloqueada = {
  bloqueada: true;
  puedeContactar: false;
  id: number;
  slug: string;
  numeroPublico: number;
  tipo: string;
  ciudad: string;
  estado: string;
  disponibilidad: Disponibilidad;
  esPrivada: true;
  fotos: Foto[];
};

export type Propiedad = PropiedadAbierta | PropiedadBloqueada;

export type RespuestaPortafolio = {
  propiedades: Propiedad[];
  vendidas: Propiedad[];
  sesion: { esMiembro: boolean };
};

// ─── Sesión ──────────────────────────────────────────────────────────────────

export function tokenDeMiembro(): string | null {
  try {
    return window.localStorage.getItem(CLAVE_SESION);
  } catch {
    // Modo privado o cookies bloqueadas: se navega como anónimo en vez de
    // romper la página.
    return null;
  }
}

export function guardarSesion(token: string) {
  try {
    window.localStorage.setItem(CLAVE_SESION, token);
  } catch {
    /* sin almacenamiento, la sesión dura lo que la pestaña */
  }
}

export function cerrarSesion() {
  try {
    window.localStorage.removeItem(CLAVE_SESION);
  } catch {
    /* nada que limpiar */
  }
}

function encabezados(): HeadersInit {
  const token = tokenDeMiembro();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Llamadas ────────────────────────────────────────────────────────────────

export async function cargarPortafolio(): Promise<RespuestaPortafolio> {
  const res = await fetch(`${BASE}/propiedades`, { headers: encabezados() });
  if (!res.ok) throw new Error(`El portafolio no respondió (${res.status})`);
  return res.json();
}

/**
 * Pide el enlace de acceso. La respuesta es la misma exista o no el correo:
 * el servidor lo hace así a propósito, para que este formulario no sirva de
 * directorio de miembros.
 */
export async function solicitarAcceso(email: string): Promise<{ mensaje: string }> {
  const res = await fetch(`${BASE}/acceso/solicitar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const cuerpo = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(cuerpo.error ?? "No se pudo enviar el enlace");
  return { mensaje: cuerpo.mensaje ?? "" };
}

export async function verificarAcceso(token: string): Promise<{ nombre: string; email: string }> {
  const res = await fetch(`${BASE}/acceso/verificar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const cuerpo = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(cuerpo.error ?? "El enlace ya se usó o venció");
  guardarSesion(cuerpo.token);
  return cuerpo.miembro;
}

export async function quienSoy(): Promise<{ esMiembro: boolean; nombre?: string; email?: string }> {
  const res = await fetch(`${BASE}/acceso/yo`, { headers: encabezados() });
  if (!res.ok) return { esMiembro: false };
  return res.json();
}

// ─── Ayudas de formato ───────────────────────────────────────────────────────

/** El cap rate viaja en centésimas para no arrastrar flotantes. */
export function capRatePct(centesimas: number): number {
  return centesimas / 100;
}

/** El ahorro se calcula, no se guarda: es la resta de dos precios. */
export function ahorroDe(p: PropiedadAbierta): number | null {
  if (p.precioLista === null || p.precioLista <= p.precioInversionista) return null;
  return p.precioLista - p.precioInversionista;
}

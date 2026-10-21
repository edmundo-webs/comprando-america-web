/*
 * Sala en vivo (comprandoamerica.com/en-vivo).
 *
 * 1. Sin ficha: registro (nombre, correo, WhatsApp con país, aviso de
 *    privacidad obligatorio, casilla opcional de información y Turnstile).
 * 2. Con ficha: el video de YouTube (con «Ver en YouTube» si no carga dentro
 *    de la página) y el panel en pestañas que el equipo maneja desde la
 *    consola del CMS: Encuesta, Preguntas aprobadas y Comentarios (el foro),
 *    con los botones arriba cuando el equipo los destaca. El panel y los
 *    comentarios se preguntan cada 4 segundos. Debajo, «Haz una pregunta».
 *
 * Todo lo que pasa en la sala lo decide el CMS (lib/salaEnVivo.ts); esta página
 * solo lo muestra.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, MessageCircle, Pin, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import CampoTelefono from "@/components/CampoTelefono";
import { TURNSTILE_SITE_KEY, useTurnstile } from "@/hooks/useTurnstile";
import { telefonoAE164, TELEFONO_VACIO, type Telefono } from "@shared/telefono";
import {
  INTERVALO_SONDEO_MS,
  MAX_COMENTARIO,
  alternarOpcion,
  comentar,
  leerComentarios,
  pestanaActiva,
  pestanasVisibles,
  avisoEncuesta,
  esLigaSegura,
  fichaGuardada,
  guardarFicha,
  leerEstado,
  olvidarFicha,
  preguntar,
  registrarse,
  salaAbierta,
  salaPorSlug,
  infoInvitacion,
  entrarConInvitacion,
  quitarInvitacionDeLaLiga,
  votar,
  type ComentarioSala,
  type EncuestaSala,
  type EstadoSala,
  type ForoSala,
  type PanelSala,
  type Pestana,
  type PestanasSala,
  type SalaInfo,
  type VideoSala,
} from "@/lib/salaEnVivo";

const NAVY = "#0B1F3A";
const NAVY_CARD = "#12294A";
const ACENTO = "#3D7FF0";
const TITULOS = "'Playfair Display', Georgia, serif";

const INPUT = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#3D7FF0] focus:outline-none";
const BOTON_PAIS = "flex shrink-0 items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white";
const NUMERO = "min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#3D7FF0] focus:outline-none";

/**
 * /en-vivo: la sala abierta de un evento publicado.
 * /en-vivo/<slug>: esa sala por su liga directa (así se entra a una sala de
 * prueba, que no sale en /en-vivo). Esas ligas no se indexan.
 */
export default function EnVivo({ params }: { params?: { slug?: string } }) {
  const slugDirecto = params?.slug;
  const [sala, setSala] = useState<SalaInfo | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [errorCarga, setErrorCarga] = useState(false);
  // La liga personal del correo (?i=…), solo con la liga directa de la sala.
  const [invitacion, setInvitacion] = useState<string | null>(() =>
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("i"));
  const [avisoInvitacion, setAvisoInvitacion] = useState<string | null>(null);

  useEffect(() => {
    setSala(undefined);
    setErrorCarga(false);
    (slugDirecto ? salaPorSlug(slugDirecto) : salaAbierta())
      .then((s) => {
        setSala(s);
        if (s) setToken(fichaGuardada(s.slug));
      })
      .catch(() => setErrorCarga(true));
  }, [slugDirecto]);

  useEffect(() => {
    if (!slugDirecto) return;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [slugDirecto]);

  useEffect(() => {
    if (token) quitarInvitacionDeLaLiga();
  }, [token]);

  const salir = useCallback(() => {
    if (sala) olvidarFicha(sala.slug);
    setToken(null);
  }, [sala]);

  return (
    <div style={{ background: NAVY, color: "#fff", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <SEOHead
        title="En vivo | Comprando América"
        description="Sala en vivo de Comprando América: la transmisión, encuestas y preguntas en tiempo real."
        path={slugDirecto ? `/en-vivo/${slugDirecto}` : "/en-vivo"}
      />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28">
        {sala === undefined && !errorCarga && <Cargando />}
        {errorCarga && <Aviso titulo="No pudimos cargar la sala" texto="Recarga la página en unos segundos." />}
        {sala === null && slugDirecto && <Aviso titulo="Esta sala no existe" texto="Revisa la liga que te compartieron." />}
        {sala === null && !slugDirecto && (
          <Aviso titulo="La sala en vivo todavía no abre" texto="Aquí verás la transmisión el día del evento. Mientras tanto, consulta los próximos eventos.">
            <a href="/eventos" className="mt-5 inline-block rounded-lg px-5 py-2.5 text-sm font-semibold" style={{ background: ACENTO }}>Ver eventos</a>
          </Aviso>
        )}
        {sala && !token && slugDirecto && invitacion && (
          <EntradaInvitacion
            sala={sala}
            invitacion={invitacion}
            onFicha={(t) => { guardarFicha(sala.slug, t); quitarInvitacionDeLaLiga(); setToken(t); }}
            onInvalida={(msg) => { quitarInvitacionDeLaLiga(); setInvitacion(null); setAvisoInvitacion(msg); }}
          />
        )}
        {sala && !token && !(slugDirecto && invitacion) && (
          <Registro sala={sala} aviso={avisoInvitacion} onFicha={(t) => { guardarFicha(sala.slug, t); setToken(t); }} />
        )}
        {sala && token && <Sala sala={sala} token={token} onSinFicha={salir} />}
      </main>
    </div>
  );
}

function Cargando() {
  return (
    <div className="flex justify-center py-24 text-white/60">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

function Aviso({ titulo, texto, children }: { titulo: string; texto: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl p-8 text-center" style={{ background: NAVY_CARD }}>
      <h1 className="text-2xl font-bold" style={{ fontFamily: TITULOS }}>{titulo}</h1>
      <p className="mt-3 text-white/70">{texto}</p>
      {children}
    </div>
  );
}

// ─── Registro ────────────────────────────────────────────────────────────────

function Registro({ sala, aviso, onFicha }: { sala: SalaInfo; aviso?: string | null; onFicha: (token: string) => void }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState<Telefono>(TELEFONO_VACIO);
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);
  const [privacidad, setPrivacidad] = useState(false);
  const [informacion, setInformacion] = useState(false);
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstile = useTurnstile(setTurnstileToken);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (nombre.trim().length < 2) return setError("Escribe tu nombre completo.");
    if (!/^\S+@\S+\.\S+$/.test(correo.trim())) return setError("Escribe un correo válido.");
    const tel = telefonoAE164(telefono.pais, telefono.numero);
    if (!tel.ok) {
      setErrorTelefono(tel.error);
      return;
    }
    setErrorTelefono(null);
    if (!privacidad) return setError("Para entrar, acepta el aviso de privacidad.");
    if (TURNSTILE_SITE_KEY && !turnstileToken) return setError("Espera a que termine la verificación de seguridad e intenta de nuevo.");

    setEnviando(true);
    const r = await registrarse({
      slug: sala.slug,
      name: nombre.trim(),
      email: correo.trim(),
      whatsapp: tel.e164,
      privacyAccepted: true,
      marketingOptIn: informacion,
      ...(turnstileToken ? { turnstileToken } : {}),
      ...(website ? { website } : {}),
    });
    setEnviando(false);
    turnstile.reiniciar();
    if (r.ok) onFicha(r.token);
    else setError(r.error);
  }

  return (
    <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-[1fr_420px]">
      <div className="pt-4">
        {sala.kicker && <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: ACENTO }}>{sala.kicker}</p>}
        <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl" style={{ fontFamily: TITULOS }}>{sala.title}</h1>
        <p className="mt-5 max-w-lg text-lg text-white/75">
          Regístrate para entrar a la sala en vivo: la transmisión, las encuestas y tus preguntas para los ponentes, en un solo lugar.
        </p>
        {!sala.open && <p className="mt-5 rounded-lg bg-white/10 px-4 py-3 text-sm text-white/80">El registro a la sala todavía no abre. Vuelve un poco antes de que empiece.</p>}
      </div>

      <form onSubmit={enviar} className="space-y-4 rounded-2xl p-6" style={{ background: NAVY_CARD }} noValidate>
        <h2 className="text-xl font-bold" style={{ fontFamily: TITULOS }}>Entra a la sala</h2>
        {aviso && <p className="rounded-lg bg-amber-500/15 px-3 py-2 text-sm text-amber-100">{aviso}</p>}
        <label className="block">
          <span className="mb-1 block text-xs text-white/60">Nombre completo</span>
          <input className={INPUT} autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={200} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-white/60">Correo electrónico</span>
          <input className={INPUT} type="email" autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} maxLength={320} />
        </label>
        <div>
          <span className="mb-1 block text-xs text-white/60">WhatsApp</span>
          <CampoTelefono valor={telefono} onCambio={setTelefono} error={errorTelefono} claseNumero={NUMERO} claseBoton={BOTON_PAIS} />
        </div>
        {/* Campo trampa: oculto para las personas. */}
        <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" />
        <label className="flex items-start gap-2 text-sm text-white/80">
          <input type="checkbox" className="mt-1" checked={privacidad} onChange={(e) => setPrivacidad(e.target.checked)} />
          <span>He leído y acepto el <a href="/privacidad" target="_blank" rel="noreferrer" className="underline" style={{ color: ACENTO }}>aviso de privacidad</a>.</span>
        </label>
        <label className="flex items-start gap-2 text-sm text-white/80">
          <input type="checkbox" className="mt-1" checked={informacion} onChange={(e) => setInformacion(e.target.checked)} />
          <span>Quiero recibir información de Comprando América por correo y WhatsApp (opcional).</span>
        </label>
        {TURNSTILE_SITE_KEY && <div ref={turnstile.contenedor} />}
        {error && <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">{error}</p>}
        <button type="submit" disabled={enviando || !sala.open} className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold disabled:opacity-50" style={{ background: ACENTO }}>
          {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Entrar a la sala
        </button>
      </form>
    </div>
  );
}

// ─── Entrada con la liga personal del correo ─────────────────────────────────

function EntradaInvitacion({ sala, invitacion, onFicha, onInvalida }: {
  sala: SalaInfo;
  invitacion: string;
  onFicha: (token: string) => void;
  onInvalida: (mensaje: string) => void;
}) {
  const [nombre, setNombre] = useState<string | null | undefined>(undefined);
  const [privacidad, setPrivacidad] = useState(false);
  const [informacion, setInformacion] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // El aviso de «liga inválida» se lee de una ref: la página lo pasa en línea y no debe volver a pedir la liga.
  const alInvalida = useRef(onInvalida);
  alInvalida.current = onInvalida;

  useEffect(() => {
    let vivo = true;
    infoInvitacion(sala.slug, invitacion).then((r) => {
      if (!vivo) return;
      if (r.ok) setNombre(r.nombre);
      else alInvalida.current(r.error);
    });
    return () => { vivo = false; };
  }, [sala.slug, invitacion]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!privacidad) return setError("Para entrar, acepta el aviso de privacidad.");
    setEnviando(true);
    const r = await entrarConInvitacion({ slug: sala.slug, invitacion, privacyAccepted: true, marketingOptIn: informacion });
    setEnviando(false);
    if (r.ok) onFicha(r.token);
    else setError(r.error);
  }

  if (nombre === undefined) return <Cargando />;
  return (
    <form onSubmit={entrar} className="mx-auto max-w-lg space-y-4 rounded-2xl p-7" style={{ background: NAVY_CARD }} noValidate>
      {sala.kicker && <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACENTO }}>{sala.kicker}</p>}
      <h1 className="text-2xl font-bold leading-tight md:text-3xl" style={{ fontFamily: TITULOS }}>{nombre ? `Hola, ${nombre}` : "Hola"}</h1>
      <p className="text-white/75">Tu lugar en <b>{sala.title}</b> ya está listo. Confirma y entra a la sala; no tienes que volver a registrarte.</p>
      {!sala.open && <p className="rounded-lg bg-white/10 px-4 py-3 text-sm text-white/80">La sala todavía no abre. Vuelve un poco antes de que empiece con esta misma liga.</p>}
      <label className="flex items-start gap-2 text-sm text-white/80">
        <input type="checkbox" className="mt-1" checked={privacidad} onChange={(e) => setPrivacidad(e.target.checked)} />
        <span>He leído y acepto el <a href="/privacidad" target="_blank" rel="noreferrer" className="underline" style={{ color: ACENTO }}>aviso de privacidad</a>.</span>
      </label>
      <label className="flex items-start gap-2 text-sm text-white/80">
        <input type="checkbox" className="mt-1" checked={informacion} onChange={(e) => setInformacion(e.target.checked)} />
        <span>Quiero recibir información de Comprando América por correo y WhatsApp (opcional).</span>
      </label>
      {error && <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">{error}</p>}
      <button type="submit" disabled={enviando || !sala.open} className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold disabled:opacity-50" style={{ background: ACENTO }}>
        {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Entrar a la sala
      </button>
    </form>
  );
}

// ─── Sala ────────────────────────────────────────────────────────────────────

function Sala({ sala, token, onSinFicha }: { sala: SalaInfo; token: string; onSinFicha: () => void }) {
  const [estado, setEstado] = useState<EstadoSala | null>(null);
  const [sinConexion, setSinConexion] = useState(false);
  const etag = useRef<string | null>(null);

  const leer = useCallback(async () => {
    const r = await leerEstado(sala.slug, token, etag.current);
    if (r.tipo === "sin-ficha") return onSinFicha();
    if (r.tipo === "error") return setSinConexion(true);
    setSinConexion(false);
    if (r.tipo === "ok") {
      etag.current = r.etag;
      setEstado(r.estado);
    }
  }, [sala.slug, token, onSinFicha]);

  useEffect(() => {
    void leer();
    const t = setInterval(() => void leer(), INTERVALO_SONDEO_MS);
    return () => clearInterval(t);
  }, [leer]);

  // Al votar se muestra de inmediato lo que respondió el CMS, sin esperar al siguiente sondeo.
  const alVotar = (myVote: number[]) => {
    etag.current = null;
    setEstado((e) => {
      if (!e) return e;
      const panel = e.panel.mode === "encuesta" && e.panel.poll ? { ...e.panel, poll: { ...e.panel.poll, myVote } } : e.panel;
      const tabs = e.tabs?.encuesta ? { ...e.tabs, encuesta: { poll: { ...e.tabs.encuesta.poll, myVote } } } : e.tabs;
      return { ...e, panel, tabs };
    });
    void leer();
  };

  if (!estado) return <Cargando />;

  return (
    <div>
      <div className="mb-4">
        {estado.kicker && <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACENTO }}>{estado.kicker}</p>}
        <h1 className="text-2xl font-bold md:text-3xl" style={{ fontFamily: TITULOS }}>{estado.title}</h1>
      </div>
      {sinConexion && <p className="mb-3 rounded-lg bg-amber-500/15 px-3 py-2 text-sm text-amber-100">Se perdió la conexión con la sala. Reintentando…</p>}
      {!estado.participa && <p className="mb-3 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80">Tu registro está en revisión. Mientras tanto puedes ver la transmisión.</p>}
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div>
          <Video video={estado.video} />
          {estado.participa && estado.open && <Preguntar slug={sala.slug} token={token} />}
        </div>
        {estado.tabs ? (
          <PanelPestanas tabs={estado.tabs} cta={estado.cta ?? null} slug={sala.slug} token={token} participa={estado.participa && estado.open} onVoto={alVotar} onSinFicha={onSinFicha} />
        ) : (
          <Panel panel={estado.panel} slug={sala.slug} token={token} participa={estado.participa && estado.open} onVoto={alVotar} />
        )}
      </div>
    </div>
  );
}

// ─── Video ───────────────────────────────────────────────────────────────────

type YT = {
  Player: new (el: HTMLElement, opciones: Record<string, unknown>) => { destroy: () => void };
};

function cargarYoutube(): Promise<YT> {
  const w = window as unknown as { YT?: YT & { loaded?: number }; onYouTubeIframeAPIReady?: () => void };
  if (w.YT?.Player) return Promise.resolve(w.YT);
  return new Promise((resolve, reject) => {
    const previo = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previo?.();
      if (w.YT) resolve(w.YT);
    };
    if (!document.getElementById("yt-iframe-api")) {
      const s = document.createElement("script");
      s.id = "yt-iframe-api";
      s.src = "https://www.youtube.com/iframe_api";
      s.onerror = () => reject(new Error("YouTube no cargó"));
      document.head.appendChild(s);
    }
  });
}

/**
 * El video con la API de YouTube: si el video no se puede ver dentro de la
 * página (el canal no permite insertarlo, o el navegador lo bloquea), se cambia
 * por el botón «Ver en YouTube». El botón también queda siempre abajo.
 */
function Video({ video }: { video: VideoSala | null }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [falla, setFalla] = useState(false);

  useEffect(() => {
    setFalla(false);
    if (!video || !contenedor.current) return;
    let vivo = true;
    let player: { destroy: () => void } | null = null;
    const destino = document.createElement("div");
    contenedor.current.replaceChildren(destino);
    cargarYoutube()
      .then((yt) => {
        if (!vivo) return;
        player = new yt.Player(destino, {
          host: "https://www.youtube-nocookie.com",
          videoId: video.videoId,
          width: "100%",
          height: "100%",
          playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
          events: { onError: () => vivo && setFalla(true) },
        });
      })
      .catch(() => vivo && setFalla(true));
    return () => {
      vivo = false;
      player?.destroy();
    };
  }, [video?.videoId]);

  if (!video) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl text-center text-white/70" style={{ background: NAVY_CARD }}>
        <p className="px-6">La transmisión empezará aquí en unos minutos.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
        <div ref={contenedor} className={`absolute inset-0 ${falla ? "hidden" : ""} [&_iframe]:h-full [&_iframe]:w-full`} />
        {falla && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-white/80">No pudimos mostrar la transmisión aquí.</p>
            <a href={video.watchUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold" style={{ background: "#FF0000" }}>
              <ExternalLink className="h-4 w-4" /> Ver en YouTube
            </a>
          </div>
        )}
      </div>
      {!falla && (
        <a href={video.watchUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-white/50 hover:text-white/80">
          ¿No carga? Ver en YouTube <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

// ─── Panel de una sola vista (CMS anterior a las pestañas) ───────────────────

function Panel({ panel, slug, token, participa, onVoto }: { panel: PanelSala; slug: string; token: string; participa: boolean; onVoto: (v: number[]) => void }) {
  return (
    <aside className="self-start rounded-2xl p-5" style={{ background: NAVY_CARD }} aria-live="polite">
      {panel.mode === "vacio" && <p className="text-white/70">Mantente atento: aquí aparecerán las encuestas y las preguntas durante la transmisión.</p>}
      {panel.mode === "preguntas" && (
        <div>
          <h2 className="mb-3 font-semibold">Preguntas del público</h2>
          <ListaPreguntas questions={panel.questions} />
        </div>
      )}
      {panel.mode === "encuesta" && (panel.poll ? <Encuesta key={panel.poll.id} poll={panel.poll} slug={slug} token={token} participa={participa} onVoto={onVoto} /> : <p className="text-white/70">La encuesta aparecerá en un momento.</p>)}
      {panel.mode === "cta" && <Botones buttons={panel.buttons} />}
    </aside>
  );
}

// ─── Panel en pestañas ───────────────────────────────────────────────────────

const NOMBRE_PESTANA: Record<Pestana, string> = { encuesta: "Encuesta", preguntas: "Preguntas", comentarios: "Comentarios" };

function PanelPestanas({ tabs, cta, slug, token, participa, onVoto, onSinFicha }: {
  tabs: PestanasSala;
  cta: { buttons: { label: string; href: string }[] } | null;
  slug: string;
  token: string;
  participa: boolean;
  onVoto: (v: number[]) => void;
  onSinFicha: () => void;
}) {
  const [activa, setActiva] = useState<Pestana | null>(null);
  const firstAnterior = useRef<Pestana | null | undefined>(undefined);
  // Cuando el equipo destaca otra pestaña, todos cambian a ella; si no, cada quien se queda en la suya.
  useEffect(() => {
    setActiva((actual) => pestanaActiva(tabs, actual, firstAnterior.current));
    firstAnterior.current = tabs.first;
  }, [tabs]);
  const visibles = pestanasVisibles(tabs);
  const vista = activa && visibles.includes(activa) ? activa : (visibles[0] ?? null);

  return (
    <aside className="self-start rounded-2xl p-5" style={{ background: NAVY_CARD }}>
      {cta && <Botones buttons={cta.buttons} />}
      {visibles.length === 0 && !cta && <p className="text-white/70">Mantente atento: aquí aparecerán las encuestas y las preguntas durante la transmisión.</p>}
      {visibles.length > 1 && (
        <div role="tablist" className={`${cta ? "mt-5" : ""} mb-4 flex gap-1 rounded-lg bg-white/5 p-1`}>
          {visibles.map((p) => (
            <button key={p} role="tab" aria-selected={vista === p} onClick={() => setActiva(p)}
              className="flex-1 rounded-md px-2 py-1.5 text-sm font-medium transition"
              style={vista === p ? { background: ACENTO, color: "#fff" } : { color: "rgba(255,255,255,.7)" }}>
              {NOMBRE_PESTANA[p]}
            </button>
          ))}
        </div>
      )}
      {visibles.length === 1 && <h2 className={`${cta ? "mt-5" : ""} mb-3 font-semibold`}>{NOMBRE_PESTANA[visibles[0]]}</h2>}
      <div aria-live="polite">
        {vista === "encuesta" && tabs.encuesta && <Encuesta key={tabs.encuesta.poll.id} poll={tabs.encuesta.poll} slug={slug} token={token} participa={participa} onVoto={onVoto} />}
        {vista === "preguntas" && tabs.preguntas && <ListaPreguntas questions={tabs.preguntas.questions} />}
      </div>
      {/* Los comentarios se siguen preguntando aunque la pestaña no esté abierta, para no perder el hilo. */}
      {tabs.comentarios && <Comentarios slug={slug} token={token} visible={vista === "comentarios"} onSinFicha={onSinFicha} />}
    </aside>
  );
}

function Botones({ buttons }: { buttons: { label: string; href: string }[] }) {
  return (
    <div className="space-y-3">
      {buttons.filter((b) => esLigaSegura(b.href)).map((b) => (
        <a key={b.href + b.label} href={b.href} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-center font-semibold" style={{ background: b.href.startsWith("https://wa.me/") ? "#25D366" : ACENTO }}>
          {b.href.startsWith("https://wa.me/") && <MessageCircle className="h-4 w-4" />} {b.label}
        </a>
      ))}
    </div>
  );
}

function ListaPreguntas({ questions }: { questions: { id: number; author: string; text: string; answered: boolean }[] }) {
  return (
    <div>
      {questions.length === 0 && <p className="text-sm text-white/60">Todavía no hay preguntas en pantalla.</p>}
      <ul className="space-y-3">
        {questions.map((q) => (
          <li key={q.id} className="rounded-lg bg-white/5 p-3">
            <p className="text-sm">{q.text}</p>
            <p className="mt-1 text-xs text-white/50">{q.author}{q.answered ? " · Respondida" : ""}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Comentarios (foro) ──────────────────────────────────────────────────────

const horaComentario = (iso: string) => new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

function Comentarios({ slug, token, visible, onSinFicha }: { slug: string; token: string; visible: boolean; onSinFicha: () => void }) {
  const [foro, setForo] = useState<ForoSala | null>(null);
  const etag = useRef<string | null>(null);
  const lista = useRef<HTMLUListElement>(null);
  const alFinal = useRef(true);

  const leer = useCallback(async () => {
    const r = await leerComentarios(slug, token, etag.current);
    if (r.tipo === "sin-ficha") return onSinFicha();
    if (r.tipo === "ok") {
      etag.current = r.etag;
      setForo(r.foro);
    }
  }, [slug, token, onSinFicha]);

  useEffect(() => {
    void leer();
    const t = setInterval(() => void leer(), INTERVALO_SONDEO_MS);
    return () => clearInterval(t);
  }, [leer]);

  // Si la persona está leyendo al final, los nuevos la siguen; si subió a leer, no se le mueve la lista.
  useEffect(() => {
    const el = lista.current;
    if (el && alFinal.current) el.scrollTop = el.scrollHeight;
  }, [foro?.comments, visible]);

  if (!visible) return null;
  if (!foro) return <p className="text-sm text-white/60">Cargando los comentarios…</p>;
  return (
    <div>
      {foro.pinned && (
        <div className="mb-3 rounded-lg border border-white/15 bg-white/10 p-3">
          <p className="mb-1 flex items-center gap-1 text-xs font-semibold" style={{ color: ACENTO }}><Pin className="h-3 w-3" /> Fijado</p>
          <Comentario c={foro.pinned} />
        </div>
      )}
      <ul ref={lista} onScroll={(e) => { const el = e.currentTarget; alFinal.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40; }}
        className="max-h-[22rem] space-y-2.5 overflow-y-auto pr-1">
        {foro.comments.length === 0 && <li className="text-sm text-white/60">Sé la primera persona en comentar.</li>}
        {foro.comments.map((c) => <li key={c.id}><Comentario c={c} /></li>)}
      </ul>
      <EscribirComentario foro={foro} slug={slug} token={token} onPublicado={() => { etag.current = null; alFinal.current = true; void leer(); }} />
    </div>
  );
}

function Comentario({ c }: { c: ComentarioSala }) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2">
      <p className="text-xs">
        <span className="font-semibold" style={c.team ? { color: ACENTO } : undefined}>{c.author}</span>
        <span className="ml-2 text-white/40">{horaComentario(c.at)}</span>
      </p>
      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm">{c.text}</p>
    </div>
  );
}

function EscribirComentario({ foro, slug, token, onPublicado }: { foro: ForoSala; slug: string; token: string; onPublicado: () => void }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null);

  if (!foro.participa) return null;
  if (foro.muted) return <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80">El equipo pausó tus comentarios en esta sala.</p>;
  if (foro.paused) return <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80">Los comentarios están en pausa por un momento.</p>;
  if (!foro.open) return null;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return setMensaje({ ok: false, texto: "Escribe tu comentario." });
    setEnviando(true);
    const r = await comentar(slug, token, texto.trim());
    setEnviando(false);
    if (r.ok) {
      setTexto("");
      setMensaje(r.publicado ? null : { ok: true, texto: r.mensaje ?? "Tu comentario está en revisión." });
      if (r.publicado) onPublicado();
    } else {
      setMensaje({ ok: false, texto: r.error });
    }
  }

  return (
    <form onSubmit={enviar} className="mt-3">
      <div className="flex gap-2">
        <input className={INPUT} value={texto} onChange={(e) => { setTexto(e.target.value); setMensaje(null); }} maxLength={MAX_COMENTARIO} placeholder="Escribe un comentario…" aria-label="Comentario" />
        <button type="submit" disabled={enviando} className="flex items-center gap-1 rounded-lg px-4 font-semibold disabled:opacity-50" style={{ background: ACENTO }} aria-label="Publicar comentario">
          {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-1 flex justify-between text-xs text-white/40">
        <span>Sale con tu nombre y la inicial de tu apellido.{foro.slowSeconds > 10 ? ` Modo lento: un comentario cada ${foro.slowSeconds} s.` : ""}</span>
        <span>{texto.length}/{MAX_COMENTARIO}</span>
      </p>
      {mensaje && <p className={`mt-1 text-sm ${mensaje.ok ? "text-emerald-200" : "text-red-200"}`}>{mensaje.texto}</p>}
    </form>
  );
}

function Encuesta({ poll, slug, token, participa, onVoto }: { poll: EncuestaSala; slug: string; token: string; participa: boolean; onVoto: (v: number[]) => void }) {
  const [elegidas, setElegidas] = useState<number[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const yaVoto = poll.myVote !== null;
  const puedeVotar = participa && poll.open && !yaVoto;

  async function enviar() {
    if (elegidas.length === 0) return setError("Elige una opción.");
    setEnviando(true);
    setError(null);
    const r = await votar(slug, token, poll.id, elegidas);
    setEnviando(false);
    if (r.ok) onVoto(r.myVote);
    else if (r.myVote) onVoto(r.myVote);
    else setError(r.error);
  }

  const aviso = avisoEncuesta(poll);
  return (
    <div>
      <h2 className="mb-1 font-semibold">{poll.question}</h2>
      {poll.kind === "opcion_multiple" && puedeVotar && <p className="mb-2 text-xs text-white/50">Puedes elegir varias.</p>}
      {poll.results ? (
        <div className="mt-3 space-y-2.5">
          {poll.results.options.map((o, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">{poll.myVote?.includes(i) && <CheckCircle2 className="h-3.5 w-3.5" style={{ color: ACENTO }} />}{o.label}</span>
                <span className="font-semibold">{o.percent}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, o.percent)}%`, background: ACENTO }} /></div>
            </div>
          ))}
          <p className="text-xs text-white/50">{poll.results.voters} {poll.results.voters === 1 ? "voto" : "votos"}{poll.open ? "" : " · Votación cerrada"}</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {poll.options.map((o, i) => {
            const marcada = (yaVoto ? poll.myVote! : elegidas).includes(i);
            return (
              <button key={i} type="button" disabled={!puedeVotar}
                onClick={() => setElegidas((e) => alternarOpcion(poll.kind, e, i))}
                className="w-full rounded-lg border px-3 py-2.5 text-left text-sm disabled:cursor-default"
                style={{ borderColor: marcada ? ACENTO : "rgba(255,255,255,.15)", background: marcada ? "rgba(61,127,240,.18)" : "transparent" }}>
                {o}
              </button>
            );
          })}
        </div>
      )}
      {aviso && <p className="mt-3 text-sm text-white/70">{aviso}</p>}
      {error && <p className="mt-2 text-sm text-red-200">{error}</p>}
      {puedeVotar && (
        <button type="button" onClick={enviar} disabled={enviando} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold disabled:opacity-50" style={{ background: ACENTO }}>
          {enviando && <Loader2 className="h-4 w-4 animate-spin" />} Votar
        </button>
      )}
    </div>
  );
}

function Preguntar({ slug, token }: { slug: string; token: string }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (texto.trim().length < 3) return setMensaje({ ok: false, texto: "Escribe tu pregunta." });
    setEnviando(true);
    const r = await preguntar(slug, token, texto.trim());
    setEnviando(false);
    setMensaje({ ok: r.ok, texto: r.mensaje });
    if (r.ok) setTexto("");
  }

  return (
    <form onSubmit={enviar} className="mt-5 rounded-2xl p-5" style={{ background: NAVY_CARD }}>
      <h2 className="mb-2 font-semibold">Haz una pregunta</h2>
      <p className="mb-3 text-xs text-white/50">El equipo la revisa antes de mostrarla. Sale con tu nombre y la inicial de tu apellido.</p>
      <div className="flex gap-2">
        <input className={INPUT} value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={500} placeholder="Escribe tu pregunta…" />
        <button type="submit" disabled={enviando} className="flex items-center gap-1 rounded-lg px-4 font-semibold disabled:opacity-50" style={{ background: ACENTO }} aria-label="Enviar pregunta">
          {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
      {mensaje && <p className={`mt-2 text-sm ${mensaje.ok ? "text-emerald-200" : "text-red-200"}`}>{mensaje.texto}</p>}
    </form>
  );
}

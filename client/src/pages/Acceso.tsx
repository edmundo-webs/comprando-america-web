import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { solicitarAcceso, verificarAcceso, quienSoy, cerrarSesion } from "@/lib/portafolio";

// Acceso de miembros del Grupo Empresarial.
//
// Es un enlace mágico, no una contraseña: el miembro pone su correo, recibe un
// enlace y entra. No hay contraseña que administrar, recuperar ni filtrar, y
// dar acceso no requiere ningún paso extra — basta que su membresía esté
// activa en el CMS.
//
// La misma página hace las dos cosas: pedir el enlace, y consumirlo cuando se
// llega con `?token=`. Separarlas obligaría al miembro a entender en cuál
// está.

const NAVY = "#0B1F3A";
const NAVY_CARD = "#0F2847";
const NAVY_BORDER = "#1E3A5F";
const BLUE = "#2563EB";

type Estado =
  | { fase: "verificando" }
  | { fase: "dentro"; nombre: string }
  | { fase: "formulario" }
  | { fase: "enviado"; mensaje: string }
  | { fase: "error"; mensaje: string };

export default function Acceso() {
  const [, navigate] = useLocation();
  const [estado, setEstado] = useState<Estado>({ fase: "verificando" });
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      // El token se quita de la barra de inmediato: si se queda, viaja en el
      // historial, en el botón de compartir y en el Referer de cualquier
      // recurso externo que cargue la página.
      window.history.replaceState({}, "", "/acceso");
      verificarAcceso(token)
        .then(m => setEstado({ fase: "dentro", nombre: m.nombre || m.email }))
        .catch(err => setEstado({ fase: "error", mensaje: err.message }));
      return;
    }

    quienSoy()
      .then(yo =>
        setEstado(
          yo.esMiembro
            ? { fase: "dentro", nombre: yo.nombre || yo.email || "miembro" }
            : { fase: "formulario" },
        ),
      )
      .catch(() => setEstado({ fase: "formulario" }));
  }, []);

  async function pedirEnlace(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || enviando) return;
    setEnviando(true);
    try {
      const { mensaje } = await solicitarAcceso(email.trim());
      setEstado({ fase: "enviado", mensaje });
    } catch (err) {
      setEstado({ fase: "error", mensaje: err instanceof Error ? err.message : "No se pudo enviar" });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ background: NAVY, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
        <div
          style={{
            width: "100%", maxWidth: "440px", background: NAVY_CARD,
            border: `1px solid ${NAVY_BORDER}`, borderRadius: "16px", padding: "32px",
          }}
        >
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
            Acceso de miembros
          </h1>

          {estado.fase === "verificando" && (
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#8FA5C0" }}>
              Verificando…
            </p>
          )}

          {estado.fase === "formulario" && (
            <>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#8FA5C0", marginBottom: "20px", lineHeight: 1.6 }}>
                Escribe el correo con el que estás registrado en el Grupo Empresarial y te mandamos
                un enlace para entrar. Sin contraseñas.
              </p>
              <form onSubmit={pedirEnlace}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: "10px",
                    border: `1px solid ${NAVY_BORDER}`, background: "#091A30", color: "#fff",
                    fontFamily: "'Inter',sans-serif", fontSize: "14px", marginBottom: "12px",
                  }}
                />
                <button
                  type="submit"
                  disabled={enviando}
                  style={{
                    width: "100%", padding: "12px", borderRadius: "10px", border: "none",
                    background: BLUE, color: "#fff", fontFamily: "'Inter',sans-serif",
                    fontSize: "14px", fontWeight: 700, cursor: enviando ? "default" : "pointer",
                    opacity: enviando ? 0.6 : 1,
                  }}
                >
                  {enviando ? "Enviando…" : "Enviar enlace de acceso"}
                </button>
              </form>
            </>
          )}

          {estado.fase === "enviado" && (
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#8FA5C0", lineHeight: 1.6 }}>
              {estado.mensaje} Revisa tu bandeja — el enlace vence en 20 minutos y sirve una sola vez.
            </p>
          )}

          {estado.fase === "dentro" && (
            <>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#8FA5C0", marginBottom: "20px", lineHeight: 1.6 }}>
                Hola {estado.nombre}. Ya puedes ver el portafolio completo.
              </p>
              <button
                onClick={() => navigate("/activos-disponibles")}
                style={{
                  width: "100%", padding: "12px", borderRadius: "10px", border: "none",
                  background: BLUE, color: "#fff", fontFamily: "'Inter',sans-serif",
                  fontSize: "14px", fontWeight: 700, cursor: "pointer", marginBottom: "10px",
                }}
              >
                Ver activos disponibles
              </button>
              <button
                onClick={() => { cerrarSesion(); setEstado({ fase: "formulario" }); }}
                style={{
                  width: "100%", padding: "10px", borderRadius: "10px",
                  border: `1px solid ${NAVY_BORDER}`, background: "transparent",
                  color: "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "13px", cursor: "pointer",
                }}
              >
                Cerrar sesión
              </button>
            </>
          )}

          {estado.fase === "error" && (
            <>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#F87171", marginBottom: "16px", lineHeight: 1.6 }}>
                {estado.mensaje}
              </p>
              <button
                onClick={() => setEstado({ fase: "formulario" })}
                style={{
                  width: "100%", padding: "12px", borderRadius: "10px", border: "none",
                  background: BLUE, color: "#fff", fontFamily: "'Inter',sans-serif",
                  fontSize: "14px", fontWeight: 700, cursor: "pointer",
                }}
              >
                Pedir un enlace nuevo
              </button>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NAVY = "#0B1F3A";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E2C06E";
const NAVY_CARD = "#112240";
const NAVY_BORDER = "#1E3A5F";

type Propiedad = {
  id: string;
  titulo: string;
  ubicacion: string;
  estado: string;
  tipo: string;
  precio: string;
  renta: string;
  cap: string;
  descripcion: string;
  tags: string[];
  disponible: boolean;
  imagen?: string;
};

const PROPIEDADES: Propiedad[] = [
  {
    id: "p1",
    titulo: "Propiedad Section 8 — Memphis, TN",
    ubicacion: "Memphis, Tennessee",
    estado: "Tennessee",
    tipo: "Section 8",
    precio: "$90,000",
    renta: "$1,100/mes",
    cap: "12–14%",
    descripcion: "Propiedad residencial con inquilino Section 8 activo. Renta garantizada con subsidio federal. Flujo positivo desde el primer mes.",
    tags: ["Flujo inmediato", "Section 8", "Pasivo"],
    disponible: true,
  },
  {
    id: "p2",
    titulo: "Propiedad Section 8 — Birmingham, AL",
    ubicacion: "Birmingham, Alabama",
    estado: "Alabama",
    tipo: "Section 8",
    precio: "$85,000",
    renta: "$1,050/mes",
    cap: "13–15%",
    descripcion: "Casa unifamiliar con contrato Section 8 vigente. Mercado de alta demanda con rentabilidad superior al promedio nacional.",
    tags: ["Alto rendimiento", "Section 8", "Renta garantizada"],
    disponible: true,
  },
  {
    id: "p3",
    titulo: "Duplex — Kansas City, MO",
    ubicacion: "Kansas City, Missouri",
    estado: "Missouri",
    tipo: "Multifamiliar",
    precio: "$160,000",
    renta: "$2,200/mes",
    cap: "10–12%",
    descripcion: "Duplex con dos unidades independientes. Excelente diversificación de flujo. Mercado en crecimiento acelerado.",
    tags: ["Multifamiliar", "Diversificación", "Crecimiento"],
    disponible: true,
  },
  {
    id: "p4",
    titulo: "Propiedad en Rehabilitación — Detroit, MI",
    ubicacion: "Detroit, Michigan",
    estado: "Michigan",
    tipo: "Fix & Flip",
    precio: "$98,000",
    renta: "—",
    cap: "Potencial 18–22%",
    descripcion: "Oportunidad de rehabilitación con alto potencial de apreciación. Requiere inversión en remodelación. Ideal para inversionistas activos.",
    tags: ["Fix & Flip", "Apreciación", "Activo"],
    disponible: false,
  },
];

const FILTROS = ["Todos", "Section 8", "Multifamiliar", "Fix & Flip"];

function PropertyCard({ p }: { p: Propiedad }) {
  function handleConsultar() {
    const msg = encodeURIComponent(
      `Hola, me interesa la propiedad: ${p.titulo} (${p.ubicacion}). Precio: ${p.precio}. ¿Está disponible?`
    );
    window.open(`https://wa.me/523346766178?text=${msg}`, "_blank");
  }

  return (
    <div style={{ background: NAVY_CARD, border: `1px solid ${p.disponible ? NAVY_BORDER : NAVY_BORDER + "60"}`, borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", opacity: p.disponible ? 1 : 0.65, position: "relative" }}>
      {/* Photo placeholder */}
      <div style={{ height: "180px", background: `linear-gradient(135deg, #091830 0%, #112240 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${GOLD}08 1px, transparent 1px), linear-gradient(90deg, ${GOLD}08 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={GOLD + "60"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        {!p.disponible && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(11,31,58,0.7)" }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: "#6A8FAF", textTransform: "uppercase", background: NAVY_CARD, padding: "6px 14px", borderRadius: "6px", border: `1px solid ${NAVY_BORDER}` }}>Próximamente</span>
          </div>
        )}
        {p.disponible && (
          <div style={{ position: "absolute", top: "12px", right: "12px" }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, color: "#0B1F3A", background: "#4CAF50", borderRadius: "5px", padding: "3px 9px", letterSpacing: "0.1em" }}>Disponible</span>
          </div>
        )}
        {/* Type badge */}
        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, color: NAVY, background: GOLD, borderRadius: "5px", padding: "3px 9px", letterSpacing: "0.08em" }}>{p.tipo}</span>
        </div>
      </div>

      <div style={{ padding: "22px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "4px", lineHeight: 1.3 }}>{p.titulo}</h3>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF" }}>{p.ubicacion}</p>
        </div>

        {/* Key metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {[["Precio", p.precio], ["Renta", p.renta], ["Cap Rate", p.cap]].map(([k, v]) => (
            <div key={k} style={{ background: `${NAVY}80`, borderRadius: "8px", padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: "#4A6580", marginBottom: "3px", letterSpacing: "0.05em" }}>{k}</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, color: GOLD }}>{v}</div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#8FA5C0", lineHeight: 1.65, flex: 1 }}>{p.descripcion}</p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {p.tags.map(tag => (
            <span key={tag} style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 600, color: `${GOLD}CC`, background: `${GOLD}12`, border: `1px solid ${GOLD}30`, borderRadius: "20px", padding: "3px 10px" }}>{tag}</span>
          ))}
        </div>

        {p.disponible ? (
          <button onClick={handleConsultar} style={{ width: "100%", padding: "12px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: NAVY, fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", border: "none", borderRadius: "9px", cursor: "pointer", marginTop: "4px" }}>
            Consultar por WhatsApp
          </button>
        ) : (
          <button disabled style={{ width: "100%", padding: "12px", background: "transparent", color: "#4A6580", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, border: `1px solid ${NAVY_BORDER}`, borderRadius: "9px", cursor: "not-allowed", marginTop: "4px" }}>
            No disponible
          </button>
        )}
      </div>
    </div>
  );
}

export default function Propiedades() {
  const [filtro, setFiltro] = useState("Todos");

  const propiedadesFiltradas = filtro === "Todos"
    ? PROPIEDADES
    : PROPIEDADES.filter(p => p.tipo === filtro);

  function handleContacto() {
    const msg = encodeURIComponent("Hola, me interesan las propiedades disponibles en Comprando América. ¿Pueden enviarme más información?");
    window.open(`https://wa.me/523346766178?text=${msg}`, "_blank");
  }

  return (
    <div style={{ background: NAVY, minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <div style={{ position: "relative", padding: "120px 24px 80px", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${GOLD}06 1px, transparent 1px), linear-gradient(90deg, ${GOLD}06 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, transparent, ${GOLD}70, transparent)` }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
            <div style={{ width: "48px", height: "1px", background: `${GOLD}70` }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.35em", color: `${GOLD}90`, textTransform: "uppercase" }}>Comprando América · Propiedades</span>
            <div style={{ width: "48px", height: "1px", background: `${GOLD}70` }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(32px,5vw,58px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "20px" }}>
            Propiedades en<br />
            <em style={{ color: GOLD_LIGHT, fontStyle: "italic" }}>Estados Unidos</em>
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", color: "#8FA5C0", lineHeight: 1.75, marginBottom: "40px", maxWidth: "560px", margin: "0 auto 40px" }}>
            Propiedades seleccionadas con criterio estratégico — flujo garantizado, estructura legal y rendimientos en dólares.
          </p>
          <button onClick={handleContacto} style={{ padding: "14px 28px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: NAVY, fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "10px", cursor: "pointer" }}>
            Hablar con un asesor
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 32px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {FILTROS.map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              style={{ padding: "8px 18px", background: filtro === f ? GOLD : "transparent", color: filtro === f ? NAVY : "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: filtro === f ? 700 : 500, border: `1px solid ${filtro === f ? GOLD : NAVY_BORDER}`, borderRadius: "20px", cursor: "pointer", transition: "all 0.2s" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "20px" }}>
          {propiedadesFiltradas.map(p => <PropertyCard key={p.id} p={p} />)}
        </div>

        {propiedadesFiltradas.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#4A6580" }}>No hay propiedades disponibles en esta categoría por el momento.</p>
          </div>
        )}

        {/* CTA Footer */}
        <div style={{ marginTop: "64px", background: NAVY_CARD, border: `1px solid ${GOLD}30`, borderRadius: "20px", padding: "48px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
          <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3vw,34px)", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
            ¿No encuentras lo que buscas?
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#8FA5C0", lineHeight: 1.7, marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>
            Cuéntanos tu objetivo y capital disponible. Te mostramos propiedades que se ajusten a tu perfil.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={handleContacto} style={{ padding: "14px 28px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: NAVY, fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", border: "none", borderRadius: "10px", cursor: "pointer" }}>
              Consultar por WhatsApp
            </button>
            <a href="/tu-ruta" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", background: "transparent", color: GOLD, fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 600, border: `1px solid ${GOLD}`, borderRadius: "10px", cursor: "pointer", textDecoration: "none" }}>
              Evaluar mi perfil →
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

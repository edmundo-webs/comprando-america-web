import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Palette ── */
const NAVY        = "#0B1F3A";
const NAVY_CARD   = "#0F2847";
const NAVY_DARK   = "#091A30";
const NAVY_BORDER = "#1E3A5F";
const BLUE        = "#2563EB";
const BLUE_LIGHT  = "#3B82F6";
const GOLD        = "#C9A84C"; // solo para métricas financieras
const GOLD_LIGHT  = "#E2C06E";

/* ── Data ── */
type Deal = {
  id: number;
  ubicacion: string;
  tipo: string;
  precio: number;
  listPrice?: number;
  savings?: number;
  beds: number;
  baths: number;
  sqft: number;
  ano: number;
  lote?: number;
  hoa?: number;
  renta: number;
  ingresoAnual: number;
  gastos: number;
  noi: number;
  cap: number;
  detalles: string[];
  zillow?: string;
};

const FOTO_POS: Record<number, string> = { 1:"center center",2:"center center",3:"center center",4:"center center",5:"center top",6:"center center" };
const FOTO_FIT: Record<number, "cover"|"contain"> = { 1:"cover",2:"contain",3:"cover",4:"cover",5:"cover",6:"cover" };
const FOTOS: Record<number, string> = {
  1: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782680688/tts-news/lksrhg3srjl3mkneb71a.png",
  2: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782680692/tts-news/iemqw3nbwx4livztfglv.png",
  3: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782680688/tts-news/xmbhlaqnvvv5zya0yrw3.png",
  4: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782680690/tts-news/bkvmnmld5iqyrepzzuoi.png",
  5: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782680689/tts-news/pxg4lqchgcexfbciw5j0.png",
  6: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782680688/tts-news/ntweo18moo6rmnjacsun.png",
};

const DEALS: Deal[] = [
  {
    id: 1, ubicacion: "Niagara Falls, NY", tipo: "Casa Unifamiliar", precio: 90000,
    beds: 2, baths: 1, sqft: 888, ano: 1930, lote: 5270,
    renta: 900, ingresoAnual: 10800, gastos: 3800, noi: 7000, cap: 7.8,
    detalles: ["Valor creció +47% en últimos 10 años","2 recámaras / 1 baño","Rango estimado: $49,000 – $63,000","Casa unifamiliar sin HOA"],
  },
  {
    id: 2, ubicacion: "Saint Petersburg, FL", tipo: "Condo", precio: 155000,
    beds: 2, baths: 1, sqft: 857, ano: 1988, hoa: 5172,
    renta: 1800, ingresoAnual: 21600, gastos: 10432, noi: 11168, cap: 7,
    detalles: ["Condo en St. Petersburg, Florida","A/C central + calefacción eléctrica","Electrodomésticos incluidos (lavadora, secadora, refrigerador, estufa, lavavajillas)","Piso de cerámica / ventiladores de techo"],
  },
  {
    id: 3, ubicacion: "Saint Petersburg, FL", tipo: "Casa Unifamiliar", precio: 350000,
    beds: 3, baths: 2, sqft: 1888, ano: 1957, lote: 8453,
    renta: 3200, ingresoAnual: 38400, gastos: 13900, noi: 24500, cap: 7,
    detalles: ["Terreno grande (8,453 sqft)","3 recámaras / 2 baños completos","Garaje adjunto incluido","A/C central + calefacción eléctrica","Deck, patio y porch exterior","Casa unifamiliar sin HOA"],
  },
  {
    id: 4, ubicacion: "Niagara Falls, NY", tipo: "Casa Unifamiliar", precio: 113000, listPrice: 128700, savings: 15700,
    beds: 3, baths: 1.5, sqft: 960, ano: 1951, lote: 5967,
    renta: 1200, ingresoAnual: 14400, gastos: 5400, noi: 9000, cap: 8,
    detalles: ["Precio $15,700 por debajo del Zestimate","3 recámaras / 1.5 baños","Calefacción de aire forzado","Exterior de vinyl (bajo mantenimiento)","Casa unifamiliar sin HOA"],
  },
  {
    id: 5, ubicacion: "St. Petersburg, FL", tipo: "Casa Unifamiliar", precio: 320000, listPrice: 359000, savings: 39000,
    beds: 2, baths: 1, sqft: 1059, ano: 1952, lote: 6281,
    renta: 2500, ingresoAnual: 30000, gastos: 11200, noi: 18800, cap: 6,
    detalles: ["Cocina remodelada","Gabinetes blancos shaker","Encimera de madera butcher block","Lista para rentar de inmediato"],
    zillow: "https://www.zillow.com/homedetails/3028-9th-ave-n-saint-petersburg-fl-33713/47077263_zpid/",
  },
  {
    id: 6, ubicacion: "St. Petersburg, FL", tipo: "Casa Unifamiliar", precio: 325000, listPrice: 425000, savings: 100000,
    beds: 3, baths: 2, sqft: 1428, ano: 1956, lote: 10824,
    renta: 2600, ingresoAnual: 31200, gastos: 11500, noi: 24660, cap: 6,
    detalles: ["Terreno grande (casi 1,000 m²)","3 recámaras / 2 baños completos","Excelente precio por debajo de valuación","Valuación Zillow: $405,000"],
    zillow: "https://www.zillow.com/homedetails/6800-dr-martin-luther-king-jr-st-s-saint-petersburg-fl-33705/47016444_zpid/",
  },
];

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/* ── DealCard ── */
type Tab = "roi" | "detalles" | null;

function DealCard({ d }: { d: Deal }) {
  const [tab, setTab] = useState<Tab>(null);
  const toggle = (t: Tab) => setTab(prev => prev === t ? null : t);
  const wa = () => {
    const msg = encodeURIComponent(`Hola, me interesa la Oportunidad #${d.id}: ${d.ubicacion} — ${usd(d.precio)}. ¿Está disponible?`);
    window.open(`https://wa.me/523346766178?text=${msg}`, "_blank");
  };

  return (
    <div
      style={{ background: NAVY_CARD, border: `1px solid ${NAVY_BORDER}`, borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.25s, box-shadow 0.25s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${BLUE}60`; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${BLUE}20`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = NAVY_BORDER; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Photo */}
      <div style={{ position: "relative", height: "220px", overflow: "hidden", background: NAVY_DARK }}>
        <img src={FOTOS[d.id]} alt={`Propiedad #${d.id} ${d.ubicacion}`}
          style={{ width: "100%", height: "100%", objectFit: FOTO_FIT[d.id], objectPosition: FOTO_POS[d.id], display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(11,31,58,0.7) 100%)" }} />

        {/* Top-left: property type badge — blue */}
        <span style={{ position: "absolute", top: "10px", left: "10px", fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, color: "#fff", background: BLUE, borderRadius: "6px", padding: "3px 10px", letterSpacing: "0.06em" }}>
          #{d.id} · {d.tipo}
        </span>

        {/* Top-right: savings badge — gold accent */}
        {d.savings && (
          <span style={{ position: "absolute", top: "10px", right: "10px", fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, color: NAVY_DARK, background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, borderRadius: "6px", padding: "3px 10px" }}>
            -{usd(d.savings)} ahorro
          </span>
        )}

        {/* Bottom-left: cap rate chip — gold (financial signal) */}
        <div style={{ position: "absolute", bottom: "10px", left: "10px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(11,31,58,0.85)", border: `1px solid ${GOLD}40`, borderRadius: "8px", padding: "5px 10px", backdropFilter: "blur(4px)" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: "#8FA5C0" }}>Cap Rate</span>
          <span style={{ fontFamily: "'Space Grotesk',monospace", fontSize: "15px", fontWeight: 800, color: GOLD }}>{d.cap}%</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px 18px", flex: 1 }}>
        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5A7A9A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF" }}>{d.ubicacion}</span>
        </div>

        {/* Price — gold for investor price (financial highlight) */}
        <div style={{ marginBottom: "14px" }}>
          {d.listPrice && (
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#3D5570", textDecoration: "line-through", marginBottom: "2px" }}>
              {usd(d.listPrice)} precio de lista
            </p>
          )}
          <p style={{ fontFamily: "'Space Grotesk',monospace", fontSize: "26px", fontWeight: 800, color: GOLD_LIGHT, lineHeight: 1 }}>
            {usd(d.precio)}
          </p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: "#4A6580", marginTop: "3px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Precio para inversionista</p>
        </div>

        {/* Specs chips — blue toned */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
          {[
            `${d.beds} rec. / ${d.baths} baños`,
            `${d.sqft.toLocaleString()} sqft`,
            `Construida ${d.ano}`,
            d.lote ? `Lote ${d.lote.toLocaleString()} sqft` : null,
            d.hoa ? `HOA ${usd(d.hoa)}/año` : "Sin HOA",
          ].filter(Boolean).map(s => (
            <span key={s!} style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#6A8FAF", background: `${BLUE}0D`, border: `1px solid ${BLUE}25`, borderRadius: "6px", padding: "3px 9px" }}>
              {s}
            </span>
          ))}
        </div>

        {/* Financial metrics row — gold accents for numbers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
          {[
            { label: "Renta mensual", value: usd(d.renta), gold: false },
            { label: "NOI anual", value: usd(d.noi), gold: true },
          ].map(({ label, value, gold }) => (
            <div key={label} style={{ background: gold ? `${GOLD}08` : `${BLUE}08`, border: `1px solid ${gold ? GOLD : BLUE}22`, borderRadius: "8px", padding: "10px 12px" }}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: "#5A7A9A", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
              <p style={{ fontFamily: "'Space Grotesk',monospace", fontSize: "15px", fontWeight: 700, color: gold ? GOLD : BLUE_LIGHT }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Expand tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
          {(["roi", "detalles"] as Tab[]).map(t => (
            <button key={t!} onClick={() => toggle(t)}
              style={{ flex: 1, padding: "8px", background: tab === t ? `${BLUE}15` : "transparent", border: `1px solid ${tab === t ? BLUE + "60" : NAVY_BORDER}`, borderRadius: "8px", color: tab === t ? BLUE_LIGHT : "#5A7A9A", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", transition: "all 0.2s" }}>
              {t === "roi" ? "Retorno" : "Detalles"}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: tab === t ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          ))}
        </div>

        {/* ROI panel */}
        {tab === "roi" && (
          <div style={{ background: NAVY_DARK, border: `1px solid ${NAVY_BORDER}`, borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
            {[
              { k: "Renta mensual", v: usd(d.renta), gold: false },
              { k: "Ingreso bruto anual", v: usd(d.ingresoAnual), gold: false },
              { k: "Gastos operativos", v: usd(d.gastos), gold: false },
              { k: "NOI anual", v: usd(d.noi), gold: true },
              { k: "Cap Rate", v: `${d.cap}%`, gold: true },
            ].map(({ k, v, gold }) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${NAVY_BORDER}50` }}>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#5A7A9A" }}>{k}</span>
                <span style={{ fontFamily: "'Space Grotesk',monospace", fontSize: "13px", fontWeight: 700, color: gold ? GOLD : "#CBD5E1" }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Detalles panel */}
        {tab === "detalles" && (
          <div style={{ background: NAVY_DARK, border: `1px solid ${NAVY_BORDER}`, borderRadius: "10px", padding: "14px", marginBottom: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {d.detalles.map(det => (
              <div key={det} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                {/* Check icon — blue for UI confirmation */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BLUE_LIGHT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#8FA5C0", lineHeight: 1.55 }}>{det}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <button onClick={wa}
          style={{ width: "100%", padding: "12px", background: `linear-gradient(90deg,${BLUE},${BLUE_LIGHT})`, color: "#fff", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", border: "none", borderRadius: "9px", cursor: "pointer", transition: "opacity 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          Consultar por WhatsApp
        </button>
        {d.zillow && (
          <a href={d.zillow} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", color: "#4A6580", fontFamily: "'Inter',sans-serif", fontSize: "11px", textDecoration: "none", borderRadius: "8px", border: `1px solid ${NAVY_BORDER}`, transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = BLUE_LIGHT; e.currentTarget.style.borderColor = `${BLUE}60`; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#4A6580"; e.currentTarget.style.borderColor = NAVY_BORDER; }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Ver en Zillow
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Page ── */
export default function Propiedades() {
  const handleContacto = () => {
    const msg = encodeURIComponent("Hola, me interesan las propiedades disponibles en Comprando América. ¿Pueden enviarme más información?");
    window.open(`https://wa.me/523346766178?text=${msg}`, "_blank");
  };

  return (
    <div style={{ background: NAVY, minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ── */}
      <div style={{ position: "relative", padding: "120px 24px 0", overflow: "hidden" }}>
        {/* Grid background — blue tint */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${BLUE}05 1px, transparent 1px), linear-gradient(90deg, ${BLUE}05 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        {/* Top accent line — blue to gold gradient */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, transparent, ${BLUE}80, ${GOLD}60, transparent)` }} />

        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px", background: `${BLUE}10`, border: `1px solid ${BLUE}30`, borderRadius: "999px", padding: "5px 16px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: BLUE_LIGHT }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.3em", color: BLUE_LIGHT, textTransform: "uppercase" }}>Comprando América · Propiedades</span>
          </div>

          <h1 style={{ fontFamily: "'Manrope','Inter',sans-serif", fontSize: "clamp(30px,5vw,54px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "18px" }}>
            Propiedades en{" "}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Estados Unidos
            </span>
          </h1>

          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#8FA5C0", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 36px" }}>
            Oportunidades filtradas con cap rates documentados. Expande cada tarjeta para ver el retorno de inversión o los detalles de la propiedad.
          </p>

          <button onClick={handleContacto}
            style={{ padding: "13px 28px", background: `linear-gradient(90deg,${BLUE},${BLUE_LIGHT})`, color: "#fff", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "10px", cursor: "pointer" }}>
            Hablar con un asesor
          </button>
        </div>

        {/* Stats bar — gold for the numbers */}
        <div style={{ maxWidth: "800px", margin: "48px auto 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: `1px solid ${NAVY_BORDER}`, borderBottom: `1px solid ${NAVY_BORDER}` }}>
          {[
            { num: "6", suffix: " propiedades", label: "Disponibles ahora" },
            { num: "6–8", suffix: "%", label: "Cap Rate promedio" },
            { num: "$90K", suffix: "+", label: "Desde" },
          ].map(({ num, suffix, label }, i) => (
            <div key={i} style={{ padding: "20px 16px", textAlign: "center", borderRight: i < 2 ? `1px solid ${NAVY_BORDER}` : "none" }}>
              <p style={{ fontFamily: "'Space Grotesk',monospace", fontSize: "22px", fontWeight: 800, color: GOLD, marginBottom: "2px" }}>
                {num}<span style={{ fontSize: "14px", color: GOLD_LIGHT }}>{suffix}</span>
              </p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#5A7A9A", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "20px" }}>
          {DEALS.map(d => <DealCard key={d.id} d={d} />)}
        </div>

        {/* ── CTA Banner ── */}
        <div style={{ marginTop: "64px", background: NAVY_CARD, border: `1px solid ${NAVY_BORDER}`, borderRadius: "20px", padding: "48px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          {/* Top line — blue+gold dual accent */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${BLUE}90, ${GOLD}60, transparent)` }} />
          {/* Subtle corner glow */}
          <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${BLUE}08 0%, transparent 70%)`, pointerEvents: "none" }} />

          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.3em", color: BLUE_LIGHT, textTransform: "uppercase", marginBottom: "12px" }}>
            ¿No encuentras lo que buscas?
          </p>
          <h2 style={{ fontFamily: "'Manrope','Inter',sans-serif", fontSize: "clamp(20px,3vw,32px)", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
            Cuéntanos tu objetivo y capital disponible.
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#8FA5C0", lineHeight: 1.7, maxWidth: "460px", margin: "0 auto 28px" }}>
            Te mostramos propiedades que se ajusten a tu perfil inversionista — desde entrada hasta portafolio.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={handleContacto}
              style={{ padding: "13px 26px", background: `linear-gradient(90deg,${BLUE},${BLUE_LIGHT})`, color: "#fff", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", border: "none", borderRadius: "10px", cursor: "pointer" }}>
              Consultar por WhatsApp
            </button>
            <a href="/tu-ruta"
              style={{ display: "inline-flex", alignItems: "center", padding: "13px 26px", background: "transparent", color: GOLD_LIGHT, fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, border: `1px solid ${GOLD}50`, borderRadius: "10px", textDecoration: "none" }}>
              Evaluar mi perfil →
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

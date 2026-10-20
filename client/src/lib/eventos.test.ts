import { describe, expect, it } from "vitest";
import { CUMBRE_BLOQUES, aEvento, cartel, ediciones, proximaCumbre, type EventoApi } from "./eventos";

// Datos ficticios con la forma que manda GET /api/public/eventos del CMS.
function api(over: Partial<EventoApi> = {}): EventoApi {
  return {
    slug: "cumbre-ficticia", type: "Cumbre", kicker: "2ª Cumbre Ficticia", title: "Título ficticio",
    summary: "Resumen", objective: "Objetivo", why: "Por qué", modalityLabel: "Online",
    location: null, platform: "Facebook y YouTube", priceLabel: "Gratuito",
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/comprando-america/eventos/flyer.jpg",
    registrationUrl: null, programUrl: null, cancelled: false,
    dateLabel: "Sábado 14 de noviembre, 2026", rangeLabel: "Sábado 14 de noviembre de 2026",
    scheduleLabel: "6 horas · 10:00 AM Houston / 10:00 AM Ciudad de México",
    agenda: [], liveStream: null,
    ...over,
  };
}

describe("eventos del CMS", () => {
  it("la Cumbre trae sus bloques y el registro", () => {
    const e = aEvento(api());
    expect(e.tipo).toBe("Online · Gratuito");
    expect(e.lugar).toBe("Facebook y YouTube");
    expect(e.bloques).toBe(CUMBRE_BLOQUES);
    expect(e.cta).toBe("Ver programa y registrarme");
    expect(e.horario).toContain("Houston");
  });

  it("un viaje trae su agenda con el día de la semana", () => {
    const e = aEvento(api({
      slug: "iw-ficticia", type: "Investment Week", location: "Ciudad Ficticia", modalityLabel: "Presencial", priceLabel: null,
      agenda: [{ date: "2026-11-03", label: "Martes 3 de noviembre", title: "Llegada", description: null }],
    }));
    expect(e.tipo).toBe("Presencial");
    expect(e.lugar).toBe("Ciudad Ficticia");
    expect(e.bloques).toBeUndefined();
    expect(e.agenda).toEqual([{ fecha: "Martes 3 de noviembre", titulo: "Llegada" }]);
    expect(e.cta).toBe("Ver el programa");
    expect(ediciones([e])).toHaveLength(1);
  });

  it("la transmisión: botón con liga, o el aviso del CMS", () => {
    expect(aEvento(api({ liveStream: { state: "abierta", url: "https://youtube.example/live", message: null } })).transmision)
      .toEqual({ url: "https://youtube.example/live", mensaje: null });
    expect(aEvento(api({ liveStream: { state: "antes", url: null, message: "La transmisión estará disponible aquí el día del evento." } })).transmision?.mensaje)
      .toContain("día del evento");
    expect(aEvento(api()).transmision).toBeNull();
  });

  it("la imagen se pide recortada a cartel", () => {
    expect(cartel("https://res.cloudinary.com/demo/image/upload/v1/a.jpg"))
      .toBe("https://res.cloudinary.com/demo/image/upload/c_fill,w_700,h_875,g_auto,q_auto,f_auto/v1/a.jpg");
    expect(cartel("https://res.cloudinary.com/demo/image/upload/c_fill,w_10/v1/a.jpg")).toBe("https://res.cloudinary.com/demo/image/upload/c_fill,w_10/v1/a.jpg");
    expect(cartel("https://otro.example/a.jpg")).toBe("https://otro.example/a.jpg");
    expect(cartel(null)).toBe("");
  });

  it("la próxima Cumbre prefiere la que sigue en pie", () => {
    const cancelada = aEvento(api({ slug: "a", cancelled: true }));
    const vigente = aEvento(api({ slug: "b" }));
    expect(proximaCumbre([cancelada, vigente])?.id).toBe("b");
    expect(proximaCumbre([cancelada])?.id).toBe("a");
    expect(proximaCumbre([])).toBeUndefined();
  });

  it("nada de Zoom en lo que dibuja el sitio", () => {
    const conExtra = { ...api(), memberJoinUrl: "https://zoom.example/j/1" } as EventoApi;
    expect(JSON.stringify(aEvento(conExtra))).not.toContain("zoom");
  });
});

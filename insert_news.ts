import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { newsArticles } from "./drizzle/schema";

async function main() {
  const uri = process.env.DATABASE_URL + '?ssl={"rejectUnauthorized":true}';
  const pool = mysql.createPool({ uri, ssl: { rejectUnauthorized: true } });
  const db = drizzle(pool);
  
  try {
    await db.insert(newsArticles).values([
      {
        title: "SCJN Permite a la UIF Congelar Cuentas Sin Orden Judicial: El Riesgo para tu Patrimonio",
        slug: "scjn-uif-congela-cuentas-sin-orden-judicial",
        description: "La Suprema Corte avaló que la UIF congele cuentas bancarias sin orden judicial, eliminando la certeza jurídica y poniendo en riesgo tu patrimonio.",
        content: "La Suprema Corte de Justicia de la Nación ha emitido un fallo histórico y alarmante para los inversionistas y ahorradores en México: la Unidad de Inteligencia Financiera (UIF) podrá congelar cuentas bancarias sin necesidad de una orden judicial previa. Esto significa una pérdida absoluta de la certeza jurídica. Sin separación de poderes y con un control gubernamental absoluto, tu patrimonio está a merced de decisiones burocráticas unilaterales. Ahora más que nunca, es vital proteger tu capital y diversificar en jurisdicciones con reglas claras e inamovibles, como Estados Unidos.",
        body: "<p>La Suprema Corte de Justicia de la Nación ha emitido un fallo histórico y alarmante para los inversionistas y ahorradores en México: la Unidad de Inteligencia Financiera (UIF) podrá congelar cuentas bancarias sin necesidad de una orden judicial previa.</p><p>Esto significa una <strong>pérdida absoluta de la certeza jurídica</strong>. Sin separación de poderes y con un control gubernamental cada vez mayor, tu patrimonio está a merced de decisiones burocráticas unilaterales. No importa si tu dinero es lícito; un error o una investigación administrativa es suficiente para inmovilizar tu flujo de efectivo de la noche a la mañana.</p><p>Ahora más que nunca, es vital proteger tu capital y diversificar en jurisdicciones con reglas claras, estado de derecho y protección a la propiedad privada, como Estados Unidos.</p>",
        url: "https://comprandoamerica.com/noticias/scjn-uif-congela-cuentas-sin-orden-judicial",
        source: "Comprando América",
        category: "economia-finanzas",
        imageUrl: "https://files.catbox.moe/k7zdgr.png",
        ctaType: "membresia",
        publishedAt: new Date(),
        fetchedAt: new Date()
      },
      {
        title: "¿Peligran tus Afores? El Plan del Gobierno para Financiar Obras y el Riesgo a tu Retiro",
        slug: "peligro-afores-gobierno-financiar-obras",
        description: "El gobierno planea usar los fondos de retiro (Afores) para financiar obras de infraestructura, poniendo en grave riesgo el patrimonio de tu retiro.",
        content: "Una nueva iniciativa legislativa de Morena busca utilizar los recursos de las Afores para financiar grandes obras de infraestructura gubernamental. Esto representa un riesgo directo a los ahorros de toda tu vida laboral. Al comprometer el dinero de los trabajadores en proyectos de dudosa rentabilidad y sin los debidos contrapesos financieros, el Estado juega con la viabilidad de tu retiro. Ante esta vulnerabilidad e incertidumbre, mover parte de tu capital a activos refugio en el mercado inmobiliario de Estados Unidos no es un lujo, es una estrategia de supervivencia financiera.",
        body: "<p>Una nueva iniciativa legislativa de Morena busca utilizar los recursos de las Afores para financiar grandes obras de infraestructura gubernamental. Esto representa un <strong>riesgo directo a los ahorros de toda tu vida laboral</strong>.</p><p>Al comprometer el dinero de los trabajadores en proyectos gubernamentales de dudosa rentabilidad y sin los debidos contrapesos financieros independientes, el Estado está jugando con la viabilidad y seguridad de tu retiro. El patrimonio que construiste por décadas podría licuarse en deuda pública.</p><p>Ante esta tremenda vulnerabilidad e incertidumbre, mover parte de tu capital a activos refugio, como el mercado inmobiliario de Estados Unidos a través de una LLC, ya no es un lujo, <strong>es una estrategia de supervivencia financiera obligatoria</strong>.</p>",
        url: "https://comprandoamerica.com/noticias/peligro-afores-gobierno-financiar-obras",
        source: "Comprando América",
        category: "economia-finanzas",
        imageUrl: "https://files.catbox.moe/u68jy0.png",
        ctaType: "inversiones",
        publishedAt: new Date(),
        fetchedAt: new Date()
      }
    ]);
    console.log("Success inserting 2 news articles.");
  } catch (err: any) {
    console.error("FAILED:", err.message);
  }
  process.exit(0);
}
main();

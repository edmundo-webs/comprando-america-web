import { getDb } from "./server/db.ts";
import { newsArticles } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const seedNews = async () => {
  console.log("[Seed] Starting news database population...");
  const db = await getDb();
  if (!db) {
    console.error("[Seed] Cannot connect to database");
    process.exit(1);
  }

  const newsData = [
    // Visas y Migraciones
    {
      title: "USCIS Aprueba 2,500 Visas E-2 en Enero 2026",
      description: "El Servicio de Ciudadanía e Inmigración de Estados Unidos reportó un aumento del 15% en aprobaciones de visa E-2 para inversionistas extranjeros.",
      content: "El USCIS ha anunciado que en enero de 2026 se aprobaron 2,500 solicitudes de visa E-2, marcando un nuevo récord mensual. Este aumento refleja el creciente interés de emprendedores latinoamericanos en invertir en negocios estadounidenses.",
      url: "https://www.uscis.gov/news/e2-visa-approvals-january-2026",
      source: "USCIS",
      category: "visas-migracion",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
      publishedAt: new Date("2026-02-15"),
    },
    {
      title: "Cambios en Trámites Migratorios para Ciudadanos Mexicanos",
      description: "El Departamento de Estado anuncia nuevos procedimientos para solicitudes de visa de inversionista desde México.",
      content: "A partir de marzo de 2026, los ciudadanos mexicanos podrán completar entrevistas de visa en línea para categorías de inversionista seleccionadas, reduciendo tiempos de procesamiento.",
      url: "https://travel.state.gov/news/mexico-visa-procedures-2026",
      source: "State Department",
      category: "visas-migracion",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      publishedAt: new Date("2026-02-14"),
    },
    {
      title: "Actualización: Visa EB-5 Requiere Inversión Mínima de $1.05M",
      description: "El USCIS actualiza los requisitos de inversión mínima para la visa EB-5 de inversionista inmigrante.",
      content: "La inversión mínima para la visa EB-5 ha aumentado a $1.05 millones para proyectos generales y $787,500 para áreas de empleo rural o desempleo alto.",
      url: "https://www.uscis.gov/eb5-minimum-investment-update-2026",
      source: "USCIS",
      category: "visas-migracion",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
      publishedAt: new Date("2026-02-10"),
    },

    // Economía y Finanzas
    {
      title: "Inflación en USA Baja a 2.3% en Enero 2026",
      description: "El Índice de Precios al Consumidor muestra una desaceleración significativa de la inflación en Estados Unidos.",
      content: "La inflación anual en Estados Unidos bajó a 2.3% en enero de 2026, acercándose al objetivo del 2% de la Reserva Federal. Este descenso es impulsado principalmente por la moderación en precios de energía.",
      url: "https://www.bls.gov/news/inflation-january-2026",
      source: "Bureau of Labor Statistics",
      category: "economia-finanzas",
      imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf35f?w=800",
      publishedAt: new Date("2026-02-12"),
    },
    {
      title: "Dólar Alcanza Máximo de 3 Años Frente a Monedas Latinoamericanas",
      description: "El tipo de cambio del dólar estadounidense se fortalece significativamente contra el peso mexicano y otras monedas de la región.",
      content: "El dólar alcanzó un máximo de 3 años frente al peso mexicano, cotizando a 20.85 pesos por dólar. Este fortalecimiento beneficia a inversionistas estadounidenses pero afecta a importadores latinoamericanos.",
      url: "https://www.xe.com/currency-charts/usd-mxn-2026",
      source: "XE Currency",
      category: "economia-finanzas",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
      publishedAt: new Date("2026-02-11"),
    },
    {
      title: "Crecimiento del PIB de USA Proyectado en 2.8% para 2026",
      description: "El Fondo Monetario Internacional revisa al alza sus proyecciones de crecimiento económico para Estados Unidos.",
      content: "El FMI proyecta un crecimiento del PIB de 2.8% para Estados Unidos en 2026, impulsado por inversión empresarial y consumo de hogares resiliente.",
      url: "https://www.imf.org/usa-gdp-forecast-2026",
      source: "International Monetary Fund",
      category: "economia-finanzas",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800",
      publishedAt: new Date("2026-02-09"),
    },

    // Bienes Raíces
    {
      title: "Precios de Vivienda en USA Suben 4.2% Anual en Q4 2025",
      description: "El Índice S&P CoreLogic muestra un crecimiento sostenido en precios de propiedades residenciales estadounidenses.",
      content: "Los precios de vivienda en Estados Unidos aumentaron 4.2% en el cuarto trimestre de 2025, con mayor crecimiento en ciudades como Austin, Miami y Denver.",
      url: "https://www.corelogic.com/news/home-price-index-q4-2025",
      source: "CoreLogic",
      category: "bienes-raices",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      publishedAt: new Date("2026-02-13"),
    },
    {
      title: "Mercado de Oficinas Experimenta Recuperación en Ciudades Principales",
      description: "Después de años de declive, el mercado inmobiliario comercial muestra signos de recuperación en Manhattan y San Francisco.",
      content: "Los valores de propiedades comerciales en Nueva York y San Francisco han aumentado 8-12% en los últimos 6 meses, impulsados por demanda de espacio de oficinas premium.",
      url: "https://www.nar.realtor/commercial-real-estate-recovery-2026",
      source: "National Association of Realtors",
      category: "bienes-raices",
      imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
      publishedAt: new Date("2026-02-08"),
    },
    {
      title: "Tasas Hipotecarias Bajan a 6.2% Promedio Nacional",
      description: "Las tasas de hipoteca de 30 años caen a su nivel más bajo en 8 meses, mejorando la asequibilidad de vivienda.",
      content: "La tasa hipotecaria promedio de 30 años en Estados Unidos bajó a 6.2%, facilitando el acceso a financiamiento para compradores de vivienda.",
      url: "https://www.freddiemac.com/mortgage-rates-february-2026",
      source: "Freddie Mac",
      category: "bienes-raices",
      imageUrl: "https://images.unsplash.com/photo-1554995207-c18210cc9105?w=800",
      publishedAt: new Date("2026-02-07"),
    },

    // LLC y Negocios
    {
      title: "Guía Completa: Cómo Registrar una LLC en Delaware en 2026",
      description: "Procedimiento paso a paso para constituir una Sociedad de Responsabilidad Limitada en el estado de Delaware.",
      content: "Delaware sigue siendo el estado preferido para registrar LLC debido a sus leyes flexibles y costos competitivos. El proceso completo toma 24-48 horas.",
      url: "https://www.delaware.gov/business/entities/llc-formation-2026",
      source: "Delaware Division of Corporations",
      category: "llc",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      publishedAt: new Date("2026-02-12"),
    },
    {
      title: "Cambios Tributarios para LLC: Lo Que Necesitas Saber",
      description: "El IRS implementa nuevas regulaciones sobre tratamiento fiscal de Sociedades de Responsabilidad Limitada.",
      content: "A partir de 2026, las LLC deben reportar información adicional sobre propietarios beneficiarios para cumplir con regulaciones anti-lavado de dinero.",
      url: "https://www.irs.gov/llc-tax-changes-2026",
      source: "Internal Revenue Service",
      category: "llc",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
      publishedAt: new Date("2026-02-06"),
    },
    {
      title: "Responsabilidad Limitada: Protege tu Patrimonio Personal",
      description: "Cómo una LLC protege tus activos personales de demandas comerciales.",
      content: "Una de las ventajas principales de una LLC es la separación legal entre tus activos personales y los de la empresa, limitando tu responsabilidad.",
      url: "https://www.sba.gov/llc-liability-protection-2026",
      source: "U.S. Small Business Administration",
      category: "llc",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      publishedAt: new Date("2026-02-05"),
    },

    // Inversiones
    {
      title: "S&P 500 Alcanza Nuevo Máximo Histórico en Febrero 2026",
      description: "El índice bursátil más importante de Estados Unidos supera los 6,500 puntos.",
      content: "El S&P 500 alcanzó un nuevo máximo histórico de 6,520 puntos, impulsado por ganancias en el sector tecnológico y expectativas de tasas de interés moderadas.",
      url: "https://www.cnbc.com/sp500-record-high-february-2026",
      source: "CNBC",
      category: "inversiones",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
      publishedAt: new Date("2026-02-14"),
    },
    {
      title: "Estrategias de Diversificación para Inversionistas Latinoamericanos",
      description: "Cómo construir un portafolio diversificado en mercados estadounidenses.",
      content: "Los expertos recomiendan una asignación de 60% acciones, 30% bonos y 10% alternativas para inversionistas con perfil moderado.",
      url: "https://www.investingcom/portfolio-diversification-2026",
      source: "Investing.com",
      category: "inversiones",
      imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf35f?w=800",
      publishedAt: new Date("2026-02-10"),
    },
    {
      title: "Fondos de Inversión Inmobiliaria (REITs) Ofrecen Rendimientos Atractivos",
      description: "Los REITs presentan oportunidades de inversión con dividendos mensuales.",
      content: "Los REITs cotizados en bolsa ofrecen rendimientos promedio del 4.5% anual con liquidez diaria, siendo ideales para inversionistas que buscan ingresos pasivos.",
      url: "https://www.reit.com/news/reit-performance-february-2026",
      source: "National Association of Real Estate Investment Trusts",
      category: "inversiones",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=800",
      publishedAt: new Date("2026-02-08"),
    },
  ];

  try {
    for (const article of newsData) {
      try {
        // Check if article already exists
        const existing = await db
          .select()
          .from(newsArticles)
          .where(eq(newsArticles.url, article.url))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(newsArticles).values(article);
          console.log(`✓ Inserted: ${article.title}`);
        } else {
          console.log(`⊘ Skipped (exists): ${article.title}`);
        }
      } catch (error) {
        console.error(`✗ Error inserting ${article.title}:`, error);
      }
    }

    console.log("[Seed] News database population completed!");
    process.exit(0);
  } catch (error) {
    console.error("[Seed] Error:", error);
    process.exit(1);
  }
};

seedNews();

export interface Deal {
  id: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  listPrice?: number;
  investorPrice: number;
  savings?: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  builtYear: number;
  lotSqft?: number;
  propertyType: "Casa Unifamiliar" | "Condo";
  hoa?: number; // anual
  monthlyRent: number;
  grossAnnualIncome: number;
  operatingExpenses: number;
  noi: number;
  capRate: number; // percentage, e.g. 7.8
  highlights: string[];
  zillowUrl?: string;
}

export const DEALS: Deal[] = [
  {
    id: 1,
    address: "2711 La Salle Ave",
    city: "Niagara Falls",
    state: "NY",
    zip: "14301",
    investorPrice: 90000,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 888,
    builtYear: 1930,
    lotSqft: 5270,
    propertyType: "Casa Unifamiliar",
    monthlyRent: 900,
    grossAnnualIncome: 10800,
    operatingExpenses: 3800,
    noi: 7000,
    capRate: 7.8,
    highlights: [
      "Valor creció +47% en últimos 10 años",
      "2 recámaras / 1 baño",
      "Casa unifamiliar sin HOA",
    ],
  },
  {
    id: 2,
    address: "11901 4th St N, Apt 4102",
    city: "Saint Petersburg",
    state: "FL",
    zip: "33716",
    investorPrice: 155000,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 857,
    builtYear: 1988,
    propertyType: "Condo",
    hoa: 5172,
    monthlyRent: 1800,
    grossAnnualIncome: 21600,
    operatingExpenses: 10432,
    noi: 11168,
    capRate: 7,
    highlights: [
      "Condo en St. Petersburg, Florida",
      "A/C central + calefacción eléctrica",
      "Electrodomésticos incluidos (lavadora, secadora, refrigerador, estufa, lavavajillas)",
      "Piso de cerámica / ventiladores de techo",
    ],
  },
  {
    id: 3,
    address: "3655 Abington Ave S",
    city: "Saint Petersburg",
    state: "FL",
    zip: "33711",
    investorPrice: 350000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1888,
    builtYear: 1957,
    lotSqft: 8453,
    propertyType: "Casa Unifamiliar",
    monthlyRent: 3200,
    grossAnnualIncome: 38400,
    operatingExpenses: 13900,
    noi: 24500,
    capRate: 7,
    highlights: [
      "Terreno grande (8,453 sqft)",
      "3 recámaras / 2 baños completos",
      "Garaje adjunto incluido",
      "A/C central + calefacción eléctrica",
      "Deck, patio y porch exterior",
      "Casa unifamiliar sin HOA",
    ],
  },
  {
    id: 4,
    address: "2727 Monroe Ave",
    city: "Niagara Falls",
    state: "NY",
    zip: "14303",
    listPrice: 128700,
    investorPrice: 113000,
    savings: 15700,
    bedrooms: 3,
    bathrooms: 1.5,
    sqft: 960,
    builtYear: 1951,
    lotSqft: 5967,
    propertyType: "Casa Unifamiliar",
    monthlyRent: 1200,
    grossAnnualIncome: 14400,
    operatingExpenses: 5400,
    noi: 9000,
    capRate: 8,
    highlights: [
      "Precio $15,700 por debajo del Zestimate",
      "3 recámaras / 1.5 baños",
      "Calefacción de aire forzado",
      "Exterior de vinyl (bajo mantenimiento)",
      "Casa unifamiliar sin HOA",
    ],
    zillowUrl:
      "https://www.zillow.com/homedetails/2727-monroe-ave-niagara-falls-ny-14303/",
  },
  {
    id: 5,
    address: "3028 9th Ave N",
    city: "Saint Petersburg",
    state: "FL",
    zip: "33713",
    listPrice: 359000,
    investorPrice: 320000,
    savings: 39000,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1059,
    builtYear: 1952,
    lotSqft: 6281,
    propertyType: "Casa Unifamiliar",
    monthlyRent: 2500,
    grossAnnualIncome: 30000,
    operatingExpenses: 11200,
    noi: 18800,
    capRate: 6,
    highlights: [
      "Cocina remodelada",
      "Gabinetes blancos shaker",
      "Encimera de madera butcher block",
      "Lista para rentar de inmediato",
    ],
    zillowUrl:
      "https://www.zillow.com/homedetails/3028-9th-ave-n-saint-petersburg-fl-33713/47077263_zpid/",
  },
  {
    id: 6,
    address: "6800 MLK Jr St S",
    city: "Saint Petersburg",
    state: "FL",
    zip: "33705",
    listPrice: 425000,
    investorPrice: 325000,
    savings: 100000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1428,
    builtYear: 1956,
    lotSqft: 10824,
    propertyType: "Casa Unifamiliar",
    monthlyRent: 2600,
    grossAnnualIncome: 31200,
    operatingExpenses: 11500,
    noi: 24660,
    capRate: 6,
    highlights: [
      "Terreno grande (casi 1,000 m²)",
      "3 recámaras / 2 baños completos",
      "Excelente precio por debajo de valuación",
      "Valuación Zillow: $405,000",
    ],
    zillowUrl:
      "https://www.zillow.com/homedetails/6800-dr-martin-luther-king-jr-st-s-saint-petersburg-fl-33705/47016444_zpid/",
  },
];

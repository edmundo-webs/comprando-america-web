import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

interface Ally {
  name: string;
  specialty: string;
  description: string;
  image: string;
}

const allies: Ally[] = [
  {
    name: "Joe Farucci",
    specialty: "Inversionista en Bienes Raíces",
    description: "Propietario de 250+ propiedades con 28 años de experiencia. Especialista en crear riqueza transgeneracional con Real Estate en Estados Unidos.",
    image: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439239/comprando-america/YfxVlywHHLmCeDRI.png",
  },

  {
    name: "Tomás Resendez",
    specialty: "Abogado de Inmigración",
    description: "Especialista en inmigración corporativa con experiencia representando a Fortune 100. Bilingüe (inglés-español), garantiza asesoramiento legal claro y preciso.",
    image: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439162/comprando-america/QGuNYwiuoAkxjDwj.png",
  },
  {
    name: "Daniel Palacios",
    specialty: "Contador CPA y Fiscalista",
    description: "Especialista en contabilidad empresarial y planeación fiscal. Experto asesorando a empresas y particulares con socios latinos.",
    image: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439036/comprando-america/CPGtnnreqZlWVzgL.png",
  },
  {
    name: "Aubrey Dwyer",
    specialty: "Abogada Corporativa",
    description: "Especializada en apertura de empresas, contratos y trademarks. Graduada de la Facultad de Derecho de la Universidad de Oklahoma.",
    image: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439166/comprando-america/QZAlYTAoaVokeCSo.jpg",
  },
  {
    name: "Destiny Bounds",
    specialty: "Abogada Corporativa y PI",
    description: "Fundadora de Bounds Law LLC, especializada en derecho corporativo, pequeñas empresas y propiedad intelectual. Autora y conferencista nacional.",
    image: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439040/comprando-america/EDQOyfeHfevdqerE.avif",
  },
  {
    name: "Sebastián Jara",
    specialty: "Consultor de Marketing Digital",
    description: "15+ años optimizando estrategias digitales y procesos de marketing con automatización e IA para empresas en inmobiliario, educación y e-commerce.",
    image: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439020/comprando-america/AGErSdSXHAFyQrnT.avif",
  },
  {
    name: "John McKee",
    specialty: "Consultor Comercial",
    description: "Experto en Estrategia Comercial con 35+ años adaptando productos al mercado estadounidense en manufactura, consumo masivo y tecnología.",
    image: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439314/comprando-america/sZacCQEqvoOyeOMO.avif",
  },
];

function AllyCard({ ally, index }: { ally: Ally; index: number }) {
  const { ref, isInView } = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-500 h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      
      <div className="relative">
        {/* Avatar */}
        <div className="mb-6 flex justify-center">
          <img
            src={ally.image}
            alt={ally.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500/20 group-hover:border-primary/50 transition-colors"
          />
        </div>

        {/* Content */}
        <h3 className="text-lg font-serif text-white text-center mb-2">{ally.name}</h3>
        <p className="text-primary text-sm font-semibold text-center mb-3">{ally.specialty}</p>
        <p className="text-white/60 text-sm leading-relaxed text-center">{ally.description}</p>
      </div>
    </motion.div>
  );
}

export default function AlliesSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="section-darker py-24 md:py-32">
      <div className="container">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
            Nuestro Equipo Multidisciplinario
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Aliados Expertos
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Acceso a un equipo de profesionales especializados en estructura legal, fiscal, inmigración y estrategia comercial para tu éxito en Estados Unidos.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allies.map((ally, index) => (
            <AllyCard key={ally.name} ally={ally} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

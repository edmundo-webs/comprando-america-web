import { EXTERNAL_LINKS } from "@/lib/constants";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B1F3A] border-t border-white/5">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                $
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight">COMPRANDO</span>
                <span className="text-blue-400 text-xs font-semibold tracking-[0.3em]">AMÉRICA</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Membresía privada de empresarios e inversionistas latinos enfocada en estructura, estrategia y ejecución en Estados Unidos.
            </p>
            <p className="text-white/30 text-xs mt-4">
              Contenido informativo. La elegibilidad, resultados y estructuras dependen del perfil y del caso.
            </p>
          </div>

          {/* Inversión */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Inversión</h4>
            <ul className="space-y-2.5">
              <li><a href="/membresia" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Membresía</a></li>
              <li><a href="/oportunidades-de-inversion-en-estados-unidos" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Oportunidades</a></li>
              <li><a href="/estructura-empresarial-en-estados-unidos" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Estructura Empresarial</a></li>
              <li><a href="/visa-e2-inversion-en-estados-unidos" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Visa E-2</a></li>
              <li><a href="/bienes-raices-en-usa" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Bienes Raíces</a></li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Recursos</h4>
            <ul className="space-y-2.5">
              <li><a href="/podcast" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Podcast</a></li>
              <li><a href="/news" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Noticias</a></li>
              <li><a href="/blog" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Blog</a></li>
              <li><a href="/eventos" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Eventos</a></li>
              <li><a href="/quienes-somos" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Quiénes Somos</a></li>
              <li><a href={EXTERNAL_LINKS.edmundoTrevino} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-blue-400 text-sm transition-colors">Edmundo Treviño</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:contact@comprandoamerica.com" className="hover:text-blue-400 transition-colors">contact@comprandoamerica.com</a>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <MessageCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="https://wa.me/523346766178" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">WhatsApp</a>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Houston, Texas</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Comprando América. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="/privacidad" className="text-white/30 hover:text-white/60 text-sm transition-colors">Privacidad</a>
            <a href="/terminos" className="text-white/30 hover:text-white/60 text-sm transition-colors">Términos</a>
            <a href="/disclaimers" className="text-white/30 hover:text-white/60 text-sm transition-colors">Disclaimers</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

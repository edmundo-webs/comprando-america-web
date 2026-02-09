import { EXTERNAL_LINKS } from "@/lib/constants";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.08_0.02_250)] border-t border-white/5">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald flex items-center justify-center text-navy-dark font-bold text-xl font-serif">
                $
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight">COMPRANDO</span>
                <span className="text-emerald text-xs font-semibold tracking-[0.3em]">AMÉRICA</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Comunidad exclusiva de inversionistas latinos que buscan elevar su patrimonio a través de adquisiciones empresariales en Estados Unidos.
            </p>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Servicios</h4>
            <ul className="space-y-2.5">
              <li><a href="#membresia" className="text-white/50 hover:text-emerald text-sm transition-colors">Membresía</a></li>
              <li><a href="#formacion" className="text-white/50 hover:text-emerald text-sm transition-colors">Formación</a></li>
              <li><a href="#visa-e2" className="text-white/50 hover:text-emerald text-sm transition-colors">Visa E-2 Inversionista</a></li>
              <li><a href="#bienes-raices" className="text-white/50 hover:text-emerald text-sm transition-colors">Bienes Raíces</a></li>
              <li><a href="#inversiones" className="text-white/50 hover:text-emerald text-sm transition-colors">Estructura de Inversión</a></li>
              <li><a href="#expansion" className="text-white/50 hover:text-emerald text-sm transition-colors">Expansión Internacional</a></li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Recursos</h4>
            <ul className="space-y-2.5">
              <li><a href="#blog" className="text-white/50 hover:text-emerald text-sm transition-colors">Blog</a></li>
              <li><a href="#podcast" className="text-white/50 hover:text-emerald text-sm transition-colors">Podcast</a></li>
              <li><a href="#quienes-somos" className="text-white/50 hover:text-emerald text-sm transition-colors">Quiénes Somos</a></li>
              <li><a href={EXTERNAL_LINKS.edmundoTrevino} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-emerald text-sm transition-colors">Edmundo Treviño</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail className="w-4 h-4 text-emerald shrink-0" />
                <span>info@comprandoamerica.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-emerald shrink-0" />
                <span>Estados Unidos</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Comprando América. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">Privacidad</a>
            <a href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

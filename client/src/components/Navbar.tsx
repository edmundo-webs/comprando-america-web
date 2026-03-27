import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAV_ITEMS, IMAGES } from "@/lib/constants";
import { openWhatsApp, WHATSAPP_PHONE, WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[oklch(0.10_0.03_250/0.95)] backdrop-blur-xl shadow-2xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <img src={IMAGES.logo} alt="Comprando América" className="h-12 w-12 transition-transform group-hover:scale-105" />
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-primary transition-colors flex items-center gap-1"
              >
                {item.label}
                {item.children && <ChevronDown className="w-3 h-3" />}
              </a>
              {item.children && openDropdown === item.label && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 mt-1 bg-[oklch(0.15_0.03_250)] border border-border rounded-lg shadow-2xl shadow-black/40 py-2 min-w-[220px]"
                >
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-white/70 hover:text-primary hover:bg-white/5 transition-colors"
                    >
                      {child.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
          <a
            href="/perfil"
            className="ml-4 px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors inline-block"
          >
            Evaluar Perfil
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[oklch(0.10_0.03_250/0.98)] backdrop-blur-xl border-t border-border overflow-hidden"
          >
            <div className="container py-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => !item.children && setIsOpen(false)}
                    className="block px-4 py-3 text-white/80 hover:text-primary transition-colors font-medium"
                  >
                    {item.label}
                  </a>
                  {item.children && (
                    <div className="pl-8 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-sm text-white/60 hover:text-primary transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="/perfil"
                onClick={() => setIsOpen(false)}
                className="block mx-4 mt-4 px-5 py-3 bg-primary text-white font-semibold text-sm rounded-lg text-center w-[calc(100%-2rem)]"
              >
                Evaluar Perfil
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

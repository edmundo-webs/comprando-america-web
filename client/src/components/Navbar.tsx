import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAV_ITEMS, IMAGES } from "@/lib/constants";
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
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <img
            src={IMAGES.logo}
            alt="Comprando América"
            className="h-12 w-12 transition-transform group-hover:scale-105"
          />
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
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                  scrolled
                    ? "text-gray-600 hover:text-primary"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
                {item.children && <ChevronDown className="w-3 h-3" />}
              </a>
              {item.children && openDropdown === item.label && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl py-2 min-w-[220px]"
                >
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors"
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
            className="ml-4 px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors inline-block shadow-sm"
          >
            Evaluar Perfil
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden p-2 ${scrolled ? "text-gray-700" : "text-white"}`}
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
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="container py-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => !item.children && setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-primary transition-colors font-medium"
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
                          className="block px-4 py-2 text-sm text-gray-500 hover:text-primary transition-colors"
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
                className="block mx-4 mt-4 px-5 py-3 bg-primary text-white font-semibold text-sm rounded-lg text-center w-[calc(100%-2rem)] hover:bg-blue-700 transition-colors"
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

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAV_ITEMS, IMAGES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { EconomicTicker } from "@/components/EconomicTicker";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Desktop: delay close so mouse can travel to dropdown */
  const handleMouseEnter = (label: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0B1F3A]/98 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-[#1E3A5F]/50"
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
              onMouseEnter={() =>
                item.children && handleMouseEnter(item.label)
              }
              onMouseLeave={handleMouseLeave}
            >
              {/* Parent link / trigger */}
              <a
                href={item.children ? undefined : item.href}
                onClick={(e) => {
                  if (item.children) {
                    e.preventDefault();
                    setOpenDropdown(
                      openDropdown === item.label ? null : item.label
                    );
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {item.label}
                {item.children && (
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      openDropdown === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </a>

              {/* Dropdown — no gap, overlaps trigger for seamless hover */}
              <AnimatePresence>
                {item.children && openDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 pt-1 min-w-[240px]"
                  >
                    <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl shadow-2xl shadow-black/40 py-2">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-5 py-3 text-sm text-slate-300 hover:text-blue-400 hover:bg-[#1E3A5F] transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <a
            href="/perfil"
            className="ml-4 px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-blue-600 transition-colors inline-block shadow-sm shadow-blue-600/20"
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
            className="lg:hidden bg-[#0B1F3A]/98 backdrop-blur-xl border-t border-[#1E3A5F]/50 overflow-hidden"
          >
            <div className="container py-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    /* Collapsible parent */
                    <button
                      onClick={() =>
                        setMobileDropdown(
                          mobileDropdown === item.label ? null : item.label
                        )
                      }
                      className="flex items-center justify-between w-full px-4 py-3 text-white/80 hover:text-blue-400 transition-colors font-medium"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-white/80 hover:text-blue-400 transition-colors font-medium"
                    >
                      {item.label}
                    </a>
                  )}

                  {/* Mobile sub-items: collapsible */}
                  <AnimatePresence>
                    {item.children && mobileDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pb-2 space-y-1 bg-[#091A30]/50 rounded-lg mx-2">
                          {item.children.map((child) => (
                            <a
                              key={child.label}
                              href={child.href}
                              onClick={() => setIsOpen(false)}
                              className="block px-4 py-3 text-sm text-slate-400 hover:text-blue-400 transition-colors"
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <a
                href="/perfil"
                onClick={() => setIsOpen(false)}
                className="block mx-4 mt-4 px-5 py-3 bg-primary text-white font-semibold text-sm rounded-lg text-center w-[calc(100%-2rem)] hover:bg-blue-600 transition-colors"
              >
                Evaluar Perfil
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    {location.startsWith('/news') && <EconomicTicker />}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import MenuFlipbook from "@/components/MenuFlipbook";
import FloatingContact from "@/components/FloatingContact";
import FeaturedItems from "@/components/FeaturedItems";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import ContactSection from "@/components/ContactSection";
import { MenuItem, ContactSettings } from "@/types";

// === CẤU HÌNH: Đổi thành true để hiện lại Menu VIP ===
const SHOW_VIP_MENU = false;

export default function HomePage() {
  const [activeMenu, setActiveMenu] = useState<"thuong" | "vip" | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMenuOpen = async (type: "thuong" | "vip") => {
    if (activeMenu === type) {
      setActiveMenu(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/menu?type=${type}`);
      const data = await res.json();
      setMenuItems(data.items || []);
      setActiveMenu(type);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
    // Scroll to menu
    setTimeout(() => {
      document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen luxury-bg">
      <HeroSection onMenuSelect={handleMenuOpen} showVip={SHOW_VIP_MENU} />
      <FeaturedItems showVip={SHOW_VIP_MENU} />

      {/* Menu Section */}
      <section id="menu-section" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Menu Selector */}
          <div className="flex justify-center gap-6 mb-12">
            <button
              onClick={() => handleMenuOpen("thuong")}
              className={`px-10 py-4 text-sm tracking-widest uppercase transition-all duration-300 ${
                activeMenu === "thuong"
                  ? "btn-gold"
                  : "btn-outline-gold"
              }`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {loading && activeMenu !== "thuong" ? "..." : SHOW_VIP_MENU ? "◆ Menu Thường ◆" : "◆ Menu ◆"}
            </button>
            {SHOW_VIP_MENU && (
              <button
                onClick={() => handleMenuOpen("vip")}
                className={`px-10 py-4 text-sm tracking-widest uppercase transition-all duration-300 ${
                  activeMenu === "vip"
                    ? "btn-gold"
                    : "btn-outline-gold"
                }`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {loading && activeMenu !== "vip" ? "..." : "◆ Menu VIP ◆"}
              </button>
            )}
          </div>

          {/* Menu Display */}
          {activeMenu && menuItems.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <h2
                  className="text-3xl text-[#D4AF37] mb-3"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {SHOW_VIP_MENU
                    ? activeMenu === "thuong" ? "THỰC ĐƠN THƯỜNG" : "THỰC ĐƠN PHÒNG VIP"
                    : "THỰC ĐƠN"}
                </h2>
                <div className="gold-divider" />
              </div>
              <MenuFlipbook items={menuItems} menuType={activeMenu} />
            </div>
          )}
        </div>
      </section>

      {/* QR Code Section */}
      <section className="py-16 px-4 border-t border-[rgba(212,175,55,0.2)]">
        <QRCodeDisplay />
      </section>

      {/* Contact & Location */}
      <ContactSection />

      {/* Footer */}
      <footer className="py-10 px-4 text-center border-t border-[rgba(212,175,55,0.15)]">
        <p
          className="text-[#D4AF37] text-lg mb-2"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          DUY DÊ 2
        </p>
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Duy Dê 2. Hân hạnh phục vụ quý khách.
        </p>
      </footer>

      {/* Floating Contact Buttons */}
      {settings && <FloatingContact settings={settings} />}

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full border-2 border-[#D4AF37] bg-[rgba(10,10,10,0.9)] text-[#D4AF37] flex items-center justify-center hover:bg-[rgba(212,175,55,0.15)] transition-colors shadow-lg"
            aria-label="Lên đầu trang"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4L4 12H16L10 4Z" fill="currentColor" />
              <rect x="8" y="11" width="4" height="6" rx="1" fill="currentColor" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}

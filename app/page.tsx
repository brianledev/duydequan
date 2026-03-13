"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import MenuFlipbook from "@/components/MenuFlipbook";
import FloatingContact from "@/components/FloatingContact";
import FeaturedItems from "@/components/FeaturedItems";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { MenuItem, ContactSettings } from "@/types";

export default function HomePage() {
  const [activeMenu, setActiveMenu] = useState<"thuong" | "vip" | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(console.error);
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
      <HeroSection onMenuSelect={handleMenuOpen} />
      <FeaturedItems />

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
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {loading && activeMenu !== "thuong" ? "..." : "◆ Menu Thường ◆"}
            </button>
            <button
              onClick={() => handleMenuOpen("vip")}
              className={`px-10 py-4 text-sm tracking-widest uppercase transition-all duration-300 ${
                activeMenu === "vip"
                  ? "btn-gold"
                  : "btn-outline-gold"
              }`}
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {loading && activeMenu !== "vip" ? "..." : "◆ Menu VIP ◆"}
            </button>
          </div>

          {/* Menu Display */}
          {activeMenu && menuItems.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <h2
                  className="text-3xl text-[#D4AF37] mb-3"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  {activeMenu === "thuong" ? "THỰC ĐƠN THƯỜNG" : "THỰC ĐƠN PHÒNG VIP"}
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

      {/* Footer */}
      <footer className="py-10 px-4 text-center border-t border-[rgba(212,175,55,0.15)]">
        <p
          className="text-[#D4AF37] text-lg mb-2"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          DUY DÊ 2
        </p>
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Duy Dê 2. Hân hạnh phục vụ quý khách.
        </p>
      </footer>

      {/* Floating Contact Buttons */}
      {settings && <FloatingContact settings={settings} />}
    </main>
  );
}

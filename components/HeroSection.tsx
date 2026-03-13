"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface HeroSectionProps {
  onMenuSelect: (type: "thuong" | "vip") => void;
}

export default function HeroSection({ onMenuSelect }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #1A1108 0%, #0A0A0A 60%), url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }}
    >
      {/* Decorative top line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
        }}
      />

      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 text-[#D4AF37] opacity-40 text-3xl select-none">
        ❖
      </div>
      <div className="absolute top-8 right-8 text-[#D4AF37] opacity-40 text-3xl select-none">
        ❖
      </div>
      <div className="absolute bottom-8 left-8 text-[#D4AF37] opacity-40 text-3xl select-none">
        ❖
      </div>
      <div className="absolute bottom-8 right-8 text-[#D4AF37] opacity-40 text-3xl select-none">
        ❖
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <Image src="/images/logo.png" alt="Duy Dê 2" width={220} height={220} className="object-contain" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </motion.div>

        {/* Restaurant Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="gold-shimmer text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.05em" }}
        >
          DUY DÊ 2
        </motion.h1>

        {/* Gold divider with ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-3 my-8"
        >
          <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <span className="text-[#D4AF37] text-2xl">✦</span>
          <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </motion.div>

        {/* Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-[#C8B882] text-xl md:text-2xl lg:text-3xl mb-4 italic"
          style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 300 }}
        >
          &ldquo;Tinh hoa ẩm thực — Hương vị đậm đà&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-gray-500 text-sm tracking-widest uppercase mb-14"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          ◆ Hân hạnh phục vụ quý khách ◆
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-5 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,175,55,0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMenuSelect("thuong")}
            className="btn-gold px-10 py-4 text-sm tracking-widest uppercase rounded-none"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            ◆ Menu Thường ◆
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(212,175,55,0.3)",
              backgroundColor: "rgba(212,175,55,0.1)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMenuSelect("vip")}
            className="btn-outline-gold px-10 py-4 text-sm tracking-widest uppercase rounded-none"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            ◆ Menu VIP ◆
          </motion.button>
        </motion.div>

        {/* Info row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-gray-500 text-xs tracking-widest uppercase"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          <span>✦ Mở cửa: 10:00 – 22:00</span>
          <span>✦ Phòng VIP sang trọng</span>
          <span>✦ Đặt bàn: liên hệ ngay</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#D4AF37] text-xs tracking-widest uppercase" style={{ fontFamily: "Cinzel, serif" }}>
          Khám phá
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#D4AF37] text-xl"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}

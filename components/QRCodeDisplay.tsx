"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export default function QRCodeDisplay() {
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://duy-de-2.vercel.app";

  return (
    <div className="max-w-sm mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p
          className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase mb-4"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          ✦ Chia Sẻ Thực Đơn ✦
        </p>
        <h3
          className="text-2xl text-white mb-3"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          QUÉT MÃ QR
        </h3>
        <p
          className="text-gray-500 text-sm mb-8"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
        >
          Quét để xem thực đơn trên điện thoại
        </p>

        <motion.div
          whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(212,175,55,0.3)" }}
          className="inline-block p-6 bg-white border-4 border-[#D4AF37]"
        >
          <QRCodeSVG
            value={siteUrl}
            size={160}
            bgColor="#FFFFFF"
            fgColor="#0A0A0A"
            level="H"
          />
        </motion.div>

        <p
          className="text-gray-600 text-xs mt-4 tracking-widest"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          {siteUrl}
        </p>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function ContactSection() {
  return (
    <section
      id="contact-section"
      className="py-20 px-4 border-t border-[rgba(212,175,55,0.2)]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p
            className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            ✦ Liên Hệ ✦
          </p>
          <h2
            className="text-3xl md:text-4xl text-white mb-4"
            style={{
              fontFamily: "Playfair Display, serif",
              letterSpacing: "0.05em",
            }}
          >
            THÔNG TIN NHÀ HÀNG
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Hotline */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{
                y: -8,
                boxShadow:
                  "0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.2)",
              }}
              className="bg-[#111] border border-[rgba(212,175,55,0.2)] p-8 text-center h-full transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[#D4AF37] flex items-center justify-center"
              >
                <FaPhone className="text-[#D4AF37] text-xl" />
              </motion.div>
              <h3
                className="text-[#D4AF37] text-lg mb-4 tracking-wider"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                HOTLINE
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:0793535135"
                  className="block text-white text-xl hover:text-[#D4AF37] transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  0793 535 135
                </a>
                <a
                  href="tel:0916226639"
                  className="block text-white text-xl hover:text-[#D4AF37] transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  0916 226 639
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Address */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{
                y: -8,
                boxShadow:
                  "0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.2)",
              }}
              className="bg-[#111] border border-[rgba(212,175,55,0.2)] p-8 text-center h-full transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[#D4AF37] flex items-center justify-center"
              >
                <FaMapMarkerAlt className="text-[#D4AF37] text-xl" />
              </motion.div>
              <h3
                className="text-[#D4AF37] text-lg mb-4 tracking-wider"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                ĐỊA CHỈ
              </h3>
              <a
                href="https://maps.google.com/?q=11B+Đàm+Thận+Huy,+Phú+Thọ+Hòa,+TP+HCM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg hover:text-[#D4AF37] transition-colors leading-relaxed"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                11B Đàm Thận Huy,
                <br />
                Phường Phú Thọ Hòa,
                <br />
                TP. Hồ Chí Minh
              </a>
            </motion.div>
          </motion.div>

          {/* Hours */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{
                y: -8,
                boxShadow:
                  "0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.2)",
              }}
              className="bg-[#111] border border-[rgba(212,175,55,0.2)] p-8 text-center h-full transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[#D4AF37] flex items-center justify-center"
              >
                <FaClock className="text-[#D4AF37] text-xl" />
              </motion.div>
              <h3
                className="text-[#D4AF37] text-lg mb-4 tracking-wider"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                GIỜ MỞ CỬA
              </h3>
              <p
                className="text-white text-lg leading-relaxed"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Hàng ngày
              </p>
              <p
                className="text-[#D4AF37] text-2xl font-semibold mt-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                10:00 — 23:00
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Google Maps Embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-14"
        >
          <div className="border border-[rgba(212,175,55,0.3)] overflow-hidden">
            <iframe
              title="Duy Dê 2 - Bản đồ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5!2d106.6324!3d10.7783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTFCIMSQw6BtIFRo4bqtbiBIdXksIFBow7ogVGjhu40gSMOyYSwgVMOibiBQaMO6LCBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1"
              width="100%"
              height="300"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

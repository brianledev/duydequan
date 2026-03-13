"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactSettings } from "@/types";
import {
  FaPhone,
  FaSms,
  FaFacebookF,
  FaViber,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";

interface FloatingContactProps {
  settings: ContactSettings;
}

const contactButtons = [
  {
    key: "zalo" as const,
    label: "Zalo",
    icon: <SiZalo size={20} />,
    color: "#0068FF",
    getLink: (s: ContactSettings) =>
      s.zalo_link || `https://zalo.me/${s.phone_number}`,
    enabled: (s: ContactSettings) => s.zalo_enabled,
  },
  {
    key: "phone" as const,
    label: "Gọi điện",
    icon: <FaPhone size={18} />,
    color: "#22C55E",
    getLink: (s: ContactSettings) => `tel:${s.phone_number}`,
    enabled: (s: ContactSettings) => s.phone_enabled && !!s.phone_number,
  },
  {
    key: "sms" as const,
    label: "Nhắn tin",
    icon: <FaSms size={20} />,
    color: "#EAB308",
    getLink: (s: ContactSettings) => `sms:${s.sms_number}`,
    enabled: (s: ContactSettings) => s.sms_enabled && !!s.sms_number,
  },
  {
    key: "facebook" as const,
    label: "Facebook",
    icon: <FaFacebookF size={18} />,
    color: "#1877F2",
    getLink: (s: ContactSettings) => s.facebook_link,
    enabled: (s: ContactSettings) => s.facebook_enabled && !!s.facebook_link,
  },
  {
    key: "viber" as const,
    label: "Viber",
    icon: <FaViber size={20} />,
    color: "#7360F2",
    getLink: (s: ContactSettings) => s.viber_link,
    enabled: (s: ContactSettings) => s.viber_enabled && !!s.viber_link,
  },
];

export default function FloatingContact({ settings }: FloatingContactProps) {
  const [expanded, setExpanded] = useState(false);

  const activeButtons = contactButtons.filter((btn) => btn.enabled(settings));

  if (activeButtons.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-8 z-50 flex flex-col-reverse items-end gap-3">
      {/* Contact buttons */}
      <AnimatePresence>
        {expanded &&
          activeButtons.map((btn, idx) => (
            <motion.a
              key={btn.key}
              href={btn.getLink(settings)}
              target={btn.key === "phone" || btn.key === "sms" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 50, scale: 0.5 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.5 }}
              transition={{ delay: idx * 0.07, type: "spring", stiffness: 300 }}
              className="float-btn flex items-center gap-3 pr-4 pl-3 py-2 rounded-full shadow-luxury"
              style={{
                background: `linear-gradient(135deg, ${btn.color}dd, ${btn.color})`,
                color: "white",
              }}
              whileHover={{ scale: 1.1, x: -5 }}
            >
              <div className="w-8 h-8 flex items-center justify-center">{btn.icon}</div>
              <span className="text-sm font-semibold whitespace-nowrap" style={{ fontFamily: "Cinzel, serif" }}>
                {btn.label}
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: expanded ? 45 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-gold-lg"
        style={{
          background: "linear-gradient(135deg, #B8960C, #D4AF37)",
          color: "#0A0A0A",
        }}
        aria-label="Liên hệ"
      >
        <span className="text-2xl font-bold">{expanded ? "✕" : "✉"}</span>
      </motion.button>
    </div>
  );
}

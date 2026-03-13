"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MenuItem } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function FeaturedItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/menu?type=thuong").then((r) => r.json()),
      fetch("/api/menu?type=vip").then((r) => r.json()),
    ])
      .then(([thuong, vip]) => {
        const allItems = [...(thuong.items || []), ...(vip.items || [])];
        const featured = allItems.filter((i: MenuItem) => i.is_featured).slice(0, 6);
        // If no featured items, show first 6 hot-pot items
        if (featured.length === 0) {
          const hotpot = allItems
            .filter((i: MenuItem) => i.category.toLowerCase().includes("lẩu"))
            .slice(0, 6);
          setItems(hotpot);
        } else {
          setItems(featured);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="py-20 px-4 border-t border-[rgba(212,175,55,0.1)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p
            className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            ✦ Đặc Sản Nhà Hàng ✦
          </p>
          <h2
            className="text-3xl md:text-4xl text-white mb-4"
            style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.05em" }}
          >
            MÓN NỔI BẬT
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <FeaturedCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ item }: { item: MenuItem }) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,55,0.2)",
      }}
      className="group bg-[#111] border border-[rgba(212,175,55,0.2)] overflow-hidden transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 bg-[#1A1A1A] overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#111]">
            <span className="text-6xl opacity-20">🍲</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] tracking-widest uppercase text-[#D4AF37] bg-[rgba(10,10,10,0.8)] px-3 py-1 border border-[rgba(212,175,55,0.3)]"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="text-white text-lg font-semibold mb-2 group-hover:text-[#D4AF37] transition-colors"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {item.name}
        </h3>
        {item.description && (
          <p
            className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(212,175,55,0.1)]">
          <span
            className="text-[#D4AF37] text-xl font-bold"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {formatPrice(item.price)}
          </span>
          <span
            className="text-[rgba(212,175,55,0.5)] text-xs tracking-wider"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            {item.menu_type === "vip" ? "VIP" : "THƯỜNG"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

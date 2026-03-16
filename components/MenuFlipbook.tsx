"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MenuItem } from "@/types";
import { formatPrice } from "@/lib/utils";

interface MenuFlipbookProps {
  items: MenuItem[];
  menuType: "thuong" | "vip";
}

interface MenuPageData {
  category: string;
  items: MenuItem[];
}

function groupByCategory(items: MenuItem[]): MenuPageData[] {
  const categoryMap = new Map<string, MenuItem[]>();
  for (const item of items) {
    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, []);
    }
    categoryMap.get(item.category)!.push(item);
  }
  return Array.from(categoryMap.entries()).map(([category, items]) => ({
    category,
    items,
  }));
}

export default function MenuFlipbook({ items, menuType }: MenuFlipbookProps) {
  const pages = useMemo(() => groupByCategory(items), [items]);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))),
    [items]
  );

  const totalPages = pages.length;

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage < 0 || newPage >= totalPages) return;
      setDirection(newPage > currentPage ? 1 : -1);
      setCurrentPage(newPage);
    },
    [currentPage, totalPages]
  );

  const filteredItems = useMemo(() => {
    const hasSearch = searchQuery.trim().length > 0;
    const hasCategory = selectedCategory.length > 0;
    if (!hasSearch && !hasCategory) return null;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => {
      const matchCategory = !hasCategory || item.category === selectedCategory;
      const matchSearch =
        !hasSearch ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory, items]);

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      rotateY: dir > 0 ? 15 : -15,
    }),
    center: { x: 0, opacity: 1, rotateY: 0 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      rotateY: dir > 0 ? -15 : 15,
    }),
  };

  const currentPageData = pages[currentPage];

  return (
    <div className="w-full">
      {/* Search & Category Filter */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#111] border border-[rgba(212,175,55,0.3)] text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 pr-10 bg-[#111] border border-[rgba(212,175,55,0.3)] text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer min-w-[200px] sm:min-w-[240px]"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23D4AF37' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Results */}
      {filteredItems !== null ? (
        <div>
          <p className="text-center text-[#D4AF37] mb-6 text-sm tracking-wider" style={{ fontFamily: "Playfair Display, serif" }}>
            Tìm thấy {filteredItems.length} món ăn
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
          {filteredItems.length === 0 && (
            <p className="text-center text-gray-500 py-12" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem" }}>
              Không tìm thấy món ăn phù hợp
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Flipbook with side arrows */}
          <div className="relative min-h-[500px]" style={{ perspective: "1500px" }}>
            {/* Left arrow - Facebook style */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-14 md:h-14 items-center justify-center rounded-full bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.9)] text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-[0_2px_12px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95"
              aria-label="Trang trước"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {/* Right arrow - Facebook style */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="flex absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-14 md:h-14 items-center justify-center rounded-full bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.9)] text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-[0_2px_12px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95"
              aria-label="Trang sau"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {/* Invisible edge tap zones - full height */}
            {currentPage > 0 && (
              <div
                onClick={() => goToPage(currentPage - 1)}
                className="absolute left-0 top-0 w-12 md:w-16 h-full z-10 cursor-pointer"
                aria-hidden="true"
              />
            )}
            {currentPage < totalPages - 1 && (
              <div
                onClick={() => goToPage(currentPage + 1)}
                className="absolute right-0 top-0 w-12 md:w-16 h-full z-10 cursor-pointer"
                aria-hidden="true"
              />
            )}

            <AnimatePresence mode="wait" custom={direction}>
              {currentPageData && (
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    rotateY: { duration: 0.4 },
                  }}
                  className="w-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Category Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-4"
                    />
                    <h3
                      className="text-2xl text-[#D4AF37] mb-1"
                      style={{ fontFamily: "Playfair Display, serif", letterSpacing: "0.1em" }}
                    >
                      {currentPageData.category}
                    </h3>
                    <div className="gold-divider mt-3" />
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentPageData.items.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <MenuItemCard item={item} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-6 py-3 btn-outline-gold disabled:opacity-30 disabled:cursor-not-allowed text-sm tracking-wider"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              ← Trang trước
            </button>

            {/* Page dots */}
            <div className="flex gap-2">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToPage(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentPage
                      ? "bg-[#D4AF37] w-6"
                      : "bg-gray-600 hover:bg-[#D4AF37]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-6 py-3 btn-outline-gold disabled:opacity-30 disabled:cursor-not-allowed text-sm tracking-wider"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Trang sau →
            </button>
          </div>

          {/* Page indicator */}
          <p
            className="text-center text-gray-500 text-sm mt-4 tracking-widest"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Trang {currentPage + 1} / {totalPages}
          </p>
        </>
      )}
    </div>
  );
}

function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.15)" }}
      className="menu-card bg-[#111] border border-[rgba(212,175,55,0.2)] overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-40 bg-[#1A1A1A] overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">🍲</span>
          </div>
        )}
        {item.is_featured && (
          <div className="absolute top-2 right-2 bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-1 tracking-wider" style={{ fontFamily: "Playfair Display, serif" }}>
            NỔI BẬT
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h4
          className="text-white font-semibold text-base mb-1 group-hover:text-[#D4AF37] transition-colors leading-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {item.name}
        </h4>
        {item.description && (
          <p className="text-gray-500 text-sm mb-3 leading-relaxed line-clamp-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#D4AF37] font-bold text-lg" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {formatPrice(item.price)}
          </span>
          <span className="text-[rgba(212,175,55,0.4)] text-xs tracking-widest uppercase" style={{ fontFamily: "Playfair Display, serif" }}>
            {item.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

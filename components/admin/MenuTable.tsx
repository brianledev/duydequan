"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { MenuItem } from "@/types";
import { formatPrice } from "@/lib/utils";

interface MenuTableProps {
  menuType: "thuong" | "vip";
}

const CATEGORIES_THUONG = [
  "Các Món Dê",
  "Các Món Nướng",
  "Các Món Lẩu",
  "Các Món Thêm",
  "Tiết Canh",
  "Các Món Khác",
];

const CATEGORIES_VIP = [
  "Các Món Dê",
  "Các Món Nướng",
  "Các Món Lẩu",
  "Các Món Thêm",
  "Tiết Canh",
  "Các Món Khác",
];

interface ModalData {
  mode: "add" | "edit";
  item?: MenuItem;
}

export default function MenuTable({ menuType }: MenuTableProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalData | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = menuType === "thuong" ? CATEGORIES_THUONG : CATEGORIES_VIP;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: menuType, limit: "200" });
      const res = await fetch(`/api/admin/menu?${params}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [menuType]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa món ăn");
        fetchItems();
      } else {
        toast.error("Lỗi xóa món ăn");
      }
    } catch {
      toast.error("Lỗi kết nối");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = filterCategory ? item.category === filterCategory : true;
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const [syncing, setSyncing] = useState(false);

  const handleSyncImages = async () => {
    const otherType = menuType === "thuong" ? "vip" : "thuong";
    const otherLabel = menuType === "thuong" ? "VIP" : "Thường";
    if (!confirm(`Sync ảnh từ menu ${otherLabel} sang menu hiện tại?\n(Chỉ sync các món chưa có ảnh, khớp theo tên)`)) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/menu/sync-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: otherType, to: menuType }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `Đã sync ${data.synced} ảnh`);
        if (data.synced > 0) fetchItems();
      } else {
        toast.error(data.error || "Lỗi sync");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <button
          onClick={() => setModal({ mode: "add" })}
          className="btn-gold px-6 py-2 text-sm tracking-wider"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          + Thêm Món
        </button>

        <button
          onClick={handleSyncImages}
          disabled={syncing}
          className="px-4 py-2 border border-[rgba(212,175,55,0.3)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] text-sm tracking-wider transition-colors disabled:opacity-50"
          style={{ fontFamily: "Cinzel, serif" }}
          title={`Sync ảnh từ menu ${menuType === "thuong" ? "VIP" : "Thường"} sang đây`}
        >
          {syncing ? "Đang sync..." : `🔄 Sync ảnh từ ${menuType === "thuong" ? "VIP" : "Thường"}`}
        </button>

        <input
          type="text"
          placeholder="Tìm kiếm món..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white text-sm focus:outline-none focus:border-[#D4AF37] sm:min-w-[200px]"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white text-sm focus:outline-none focus:border-[#D4AF37]"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <span className="flex items-center text-gray-500 text-sm sm:ml-auto" style={{ fontFamily: "Cinzel, serif" }}>
          {filteredItems.length} món
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-[#D4AF37] animate-pulse" style={{ fontFamily: "Cinzel, serif" }}>
          ĐANG TẢI...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="luxury-table w-full">
            <thead>
              <tr>
                <th className="text-left w-16">Ảnh</th>
                <th className="text-left">Tên món</th>
                <th className="text-left hidden sm:table-cell">Danh mục</th>
                <th className="text-left">Giá</th>
                <th className="text-center w-24 hidden sm:table-cell">Nổi bật</th>
                <th className="text-center w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="w-12 h-12 bg-[#1A1A1A] overflow-hidden relative">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700 text-lg">
                          🍲
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <p className="text-white text-sm font-semibold" style={{ fontFamily: "Playfair Display, serif" }}>
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-gray-600 text-xs mt-0.5 line-clamp-1">{item.description}</p>
                    )}
                  </td>
                  <td>
                    <span className="text-xs text-[#D4AF37] bg-[rgba(212,175,55,0.1)] px-2 py-1 whitespace-nowrap hidden sm:inline">{item.category}</span>
                  </td>
                  <td>
                    <span className="text-[#D4AF37] font-semibold text-sm">{formatPrice(item.price)}</span>
                  </td>
                  <td className="text-center hidden sm:table-cell">
                    <span className={`text-xs ${item.is_featured ? "text-[#D4AF37]" : "text-gray-700"}`}>
                      {item.is_featured ? "✦ Có" : "—"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setModal({ mode: "edit", item })}
                        className="text-xs px-3 py-1 border border-[rgba(212,175,55,0.3)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-colors"
                        style={{ fontFamily: "Cinzel, serif" }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="text-xs px-3 py-1 border border-[rgba(220,50,50,0.3)] text-red-400 hover:bg-[rgba(220,50,50,0.1)] transition-colors"
                        style={{ fontFamily: "Cinzel, serif" }}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-600" style={{ fontFamily: "Cinzel, serif" }}>
                    Chưa có món ăn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <MenuItemModal
          mode={modal.mode}
          item={modal.item}
          menuType={menuType}
          categories={categories}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            fetchItems();
          }}
        />
      )}
    </div>
  );
}

interface ModalProps {
  mode: "add" | "edit";
  item?: MenuItem;
  menuType: "thuong" | "vip";
  categories: string[];
  onClose: () => void;
  onSuccess: () => void;
}

function MenuItemModal({ mode, item, menuType, categories, onClose, onSuccess }: ModalProps) {
  const [form, setForm] = useState({
    name: item?.name || "",
    category: item?.category || categories[0],
    price: item?.price || "",
    description: item?.description || "",
    image: item?.image || "",
    is_featured: item?.is_featured || false,
    order_index: item?.order_index || 0,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận JPG, PNG, WEBP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File không được vượt quá 5MB");
      return;
    }
    setUploading(true);
    setUploadProgress(10);
    try {
      const formData = new FormData();
      formData.append("file", file);
      setUploadProgress(30);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      setUploadProgress(80);
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((f) => ({ ...f, image: data.url }));
        setUploadProgress(100);
        toast.success("Ảnh đã upload");
      } else {
        toast.error(data.error || "Lỗi upload ảnh");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = mode === "edit" ? `/api/admin/menu/${item!.id}` : "/api/admin/menu";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, menu_type: menuType }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(mode === "edit" ? "Đã cập nhật món" : "Đã thêm món mới");
        onSuccess();
      } else {
        toast.error(data.error || "Lỗi lưu dữ liệu");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-[rgba(212,175,55,0.3)] w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[rgba(212,175,55,0.15)]">
          <h3 className="text-[#D4AF37] text-lg" style={{ fontFamily: "Cinzel, serif" }}>
            {mode === "add" ? "THÊM MÓN MỚI" : "CHỈNH SỬA MÓN"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[#D4AF37] text-xs tracking-widest mb-1" style={{ fontFamily: "Cinzel, serif" }}>Tên món *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[#D4AF37] text-xs tracking-widest mb-1" style={{ fontFamily: "Cinzel, serif" }}>Danh mục *</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-[#D4AF37] text-xs tracking-widest mb-1" style={{ fontFamily: "Cinzel, serif" }}>Giá *</label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
              placeholder="vd: 135.000 hoặc 135000"
              className="w-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#D4AF37] text-xs tracking-widest mb-1" style={{ fontFamily: "Cinzel, serif" }}>Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-3 py-2 focus:outline-none focus:border-[#D4AF37] resize-none"
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-[#D4AF37] text-xs tracking-widest mb-1" style={{ fontFamily: "Cinzel, serif" }}>Ảnh món</label>
            
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded p-4 text-center transition-colors ${
                dragOver
                  ? "border-[#D4AF37] bg-[rgba(212,175,55,0.05)]"
                  : "border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.4)]"
              }`}
            >
              {form.image ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-20 flex-shrink-0 border border-[rgba(212,175,55,0.2)] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-gray-400 text-xs truncate max-w-[200px]">{form.image.split("/").pop()}</p>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image: "" }))}
                      className="text-red-400 text-xs hover:text-red-300 mt-1"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    id="img-upload"
                    className="hidden"
                  />
                  <label htmlFor="img-upload" className="cursor-pointer block">
                    <div className="text-3xl mb-2 opacity-40">📷</div>
                    <p className="text-gray-400 text-sm">
                      {uploading ? "Đang upload..." : "Kéo thả ảnh vào đây hoặc click để chọn"}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">JPG, PNG, WEBP — tối đa 5MB</p>
                  </label>
                </>
              )}
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="mt-2 h-1.5 bg-[#1A1A1A] rounded overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={form.is_featured}
              onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
              className="w-4 h-4 accent-[#D4AF37]"
            />
            <label htmlFor="featured" className="text-gray-300 text-sm" style={{ fontFamily: "Cinzel, serif", letterSpacing: "0.05em" }}>
              Món nổi bật
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-gold py-3 text-sm tracking-wider disabled:opacity-60"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {saving ? "ĐANG LƯU..." : mode === "add" ? "THÊM MÓN" : "LƯU THAY ĐỔI"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 btn-outline-gold text-sm tracking-wider"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              HỦY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

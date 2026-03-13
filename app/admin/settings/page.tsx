"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import AdminSidebar from "@/components/admin/Sidebar";
import { ContactSettings } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => toast.error("Lỗi tải cài đặt"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Đã lưu cài đặt");
        setSettings(data.settings);
      } else {
        toast.error(data.error || "Lỗi lưu cài đặt");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setSaving(false);
    }
  };

  const field = (
    label: string,
    key: keyof ContactSettings,
    type: "text" | "url" | "tel" | "checkbox" = "text",
    placeholder = ""
  ) => {
    if (!settings) return null;
    if (type === "checkbox") {
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings[key] as boolean}
            onChange={(e) =>
              setSettings({ ...settings, [key]: e.target.checked })
            }
            className="w-4 h-4 accent-[#D4AF37]"
          />
          <span className="text-gray-300" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}>
            {label}
          </span>
        </label>
      );
    }
    return (
      <div>
        <label className="block text-[#D4AF37] text-xs tracking-widest mb-1" style={{ fontFamily: "Cinzel, serif" }}>
          {label}
        </label>
        <input
          type={type}
          value={(settings[key] as string) || ""}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          placeholder={placeholder}
          className="w-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem" }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] lg:flex">
      <Toaster position="top-right" toastOptions={{ style: { background: "#1A1A1A", color: "#F5F5DC", border: "1px solid rgba(212,175,55,0.3)" } }} />
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 p-4 lg:p-8 lg:ml-64">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl lg:text-3xl text-[#D4AF37] mb-2" style={{ fontFamily: "Cinzel, serif" }}>
            CÀI ĐẶT LIÊN HỆ
          </h1>
          <div className="h-px bg-gradient-to-r from-[#D4AF37] to-transparent mb-1 w-40" />
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#D4AF37] animate-pulse" style={{ fontFamily: "Cinzel, serif" }}>ĐANG TẢI...</div>
        ) : settings ? (
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Zalo */}
              <div className="bg-[#111] border border-[rgba(212,175,55,0.15)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#0068FF" }}>
                    <span className="text-white text-xs font-bold">Z</span>
                  </div>
                  <h3 className="text-[#D4AF37] tracking-widest text-sm" style={{ fontFamily: "Cinzel, serif" }}>ZALO</h3>
                </div>
                <div className="space-y-3">
                  {field("Kích hoạt Zalo", "zalo_enabled", "checkbox")}
                  {field("Link Zalo (https://zalo.me/...)", "zalo_link", "url", "https://zalo.me/0901234567")}
                </div>
              </div>

              {/* Facebook */}
              <div className="bg-[#111] border border-[rgba(212,175,55,0.15)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#1877F2" }}>
                    <span className="text-white text-xs font-bold">f</span>
                  </div>
                  <h3 className="text-[#D4AF37] tracking-widest text-sm" style={{ fontFamily: "Cinzel, serif" }}>FACEBOOK</h3>
                </div>
                <div className="space-y-3">
                  {field("Kích hoạt Facebook", "facebook_enabled", "checkbox")}
                  {field("Link Fanpage Facebook", "facebook_link", "url", "https://facebook.com/laudehoanggia")}
                </div>
              </div>

              {/* Phone */}
              <div className="bg-[#111] border border-[rgba(212,175,55,0.15)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#22C55E" }}>
                    <span className="text-white text-xs font-bold">☎</span>
                  </div>
                  <h3 className="text-[#D4AF37] tracking-widest text-sm" style={{ fontFamily: "Cinzel, serif" }}>ĐIỆN THOẠI</h3>
                </div>
                <div className="space-y-3">
                  {field("Kích hoạt nút gọi điện", "phone_enabled", "checkbox")}
                  {field("Số điện thoại", "phone_number", "tel", "0901234567")}
                </div>
              </div>

              {/* SMS */}
              <div className="bg-[#111] border border-[rgba(212,175,55,0.15)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#EAB308" }}>
                    <span className="text-white text-xs font-bold">✉</span>
                  </div>
                  <h3 className="text-[#D4AF37] tracking-widest text-sm" style={{ fontFamily: "Cinzel, serif" }}>SMS</h3>
                </div>
                <div className="space-y-3">
                  {field("Kích hoạt nút SMS", "sms_enabled", "checkbox")}
                  {field("Số điện thoại SMS", "sms_number", "tel", "0901234567")}
                </div>
              </div>

              {/* Viber */}
              <div className="bg-[#111] border border-[rgba(212,175,55,0.15)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#7360F2" }}>
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <h3 className="text-[#D4AF37] tracking-widest text-sm" style={{ fontFamily: "Cinzel, serif" }}>VIBER</h3>
                </div>
                <div className="space-y-3">
                  {field("Kích hoạt Viber", "viber_enabled", "checkbox")}
                  {field("Link Viber (viber://...)", "viber_link", "url", "viber://chat?number=+840901234567")}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={saving}
                className="btn-gold px-10 py-3 tracking-widest disabled:opacity-60 text-sm"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                {saving ? "ĐANG LƯU..." : "LƯU CÀI ĐẶT"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-red-400">Không tải được cài đặt</p>
        )}
      </main>
    </div>
  );
}

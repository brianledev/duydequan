import { PrismaClient, MenuType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;
const DEFAULT_PASSWORD = "123456789A@?1";

const adminUsers = [
  { username: "khanhln" },
  { username: "admin01" },
  { username: "admin02" },
];

// ============================================================
// MENU THƯỜNG - Regular Menu
// ============================================================
const menuThuong = [
  // ---- Các Món Dê ----
  { category: "Các Món Dê", name: "Huyết Hấp", price: 50000, order_index: 1 },
  { category: "Các Món Dê", name: "Dồi Dê", price: 130000, order_index: 2 },
  { category: "Các Món Dê", name: "Chả Đùm", price: 130000, order_index: 3 },
  { category: "Các Món Dê", name: "Dê Hấp", price: 150000, order_index: 4, is_featured: true },
  { category: "Các Món Dê", name: "Dê Hấp Tảng", price: 200000, order_index: 5 },
  { category: "Các Món Dê", name: "Dê Tái Chanh", price: 140000, order_index: 6, is_featured: true },
  { category: "Các Món Dê", name: "Dê Bóp Thấu", price: 140000, order_index: 7 },
  { category: "Các Món Dê", name: "Dê Phay", price: 150000, order_index: 8 },
  { category: "Các Món Dê", name: "Ngọc Dương Hấp", price: 350000, order_index: 9, description: "350k – 500k / bộ" },
  { category: "Các Món Dê", name: "Huyết Xào Giá Hẹ", price: 80000, order_index: 10 },
  { category: "Các Món Dê", name: "Mì Xào Rau", price: 80000, order_index: 11 },
  { category: "Các Món Dê", name: "Dê Xào Rửa Mận", price: 140000, order_index: 12 },
  { category: "Các Món Dê", name: "Dê Xào Riềng Mẻ", price: 140000, order_index: 13 },
  { category: "Các Món Dê", name: "Dê Xào Mì", price: 140000, order_index: 14 },
  { category: "Các Món Dê", name: "Dê Xào Lá Chanh", price: 140000, order_index: 15 },
  { category: "Các Món Dê", name: "Dê Xào Lăn Khô", price: 140000, order_index: 16 },
  { category: "Các Món Dê", name: "Dê Lúc Lắc", price: 140000, order_index: 17 },
  { category: "Các Món Dê", name: "Dê Xối Sả", price: 170000, order_index: 18 },
  { category: "Các Món Dê", name: "Dê Xào Lăn", price: 170000, order_index: 19, is_featured: true },
  { category: "Các Món Dê", name: "Gối Dê Xào Tỏi", price: 200000, order_index: 20 },
  { category: "Các Món Dê", name: "Dựng Dê Chiên Nước Mắm", price: 200000, order_index: 21 },
  { category: "Các Món Dê", name: "Sườn Dê Cháy Tỏi", price: 200000, order_index: 22 },
  { category: "Các Món Dê", name: "Sườn Chiên Nước Mắm", price: 200000, order_index: 23 },

  // ---- Các Món Nướng ----
  { category: "Các Món Nướng", name: "Sườn Chìa Nướng Sa Tế", price: 70000, order_index: 1, description: "70k / cây" },
  { category: "Các Món Nướng", name: "Sườn Chìa Nướng Ngũ Vị", price: 70000, order_index: 2, description: "70k / cây" },
  { category: "Các Món Nướng", name: "Sườn Nướng Sa Tế", price: 135000, order_index: 3 },
  { category: "Các Món Nướng", name: "Sườn Nướng Y", price: 135000, order_index: 4 },
  { category: "Các Món Nướng", name: "Sườn Nướng Giả Cầy", price: 135000, order_index: 5 },
  { category: "Các Món Nướng", name: "Sườn Nướng Ngũ Vị", price: 135000, order_index: 6 },
  { category: "Các Món Nướng", name: "Sườn Nướng Nước Mắm", price: 135000, order_index: 7 },
  { category: "Các Món Nướng", name: "Sườn Nướng Tiêu Xanh", price: 135000, order_index: 8 },
  { category: "Các Món Nướng", name: "Sườn Nướng Chao", price: 135000, order_index: 9 },
  { category: "Các Món Nướng", name: "Vú Nướng", price: 135000, order_index: 10 },
  { category: "Các Món Nướng", name: "Vú Chiên Giòn", price: 135000, order_index: 11 },
  { category: "Các Món Nướng", name: "Vú Nướng Tiêu Xanh", price: 135000, order_index: 12 },
  { category: "Các Món Nướng", name: "Dê Nướng Y", price: 135000, order_index: 13, is_featured: true },
  { category: "Các Món Nướng", name: "Dê Nướng Sa Tế", price: 135000, order_index: 14 },
  { category: "Các Món Nướng", name: "Dê Nướng Ngũ Vị", price: 135000, order_index: 15 },
  { category: "Các Món Nướng", name: "Dê Nướng Giả Cầy", price: 135000, order_index: 16 },
  { category: "Các Món Nướng", name: "Dê Nướng Nước Mắm", price: 135000, order_index: 17 },
  { category: "Các Món Nướng", name: "Dê Lui Sả Nướng", price: 135000, order_index: 18 },
  { category: "Các Món Nướng", name: "Dê Nướng Tiêu Xanh", price: 135000, order_index: 19 },
  { category: "Các Món Nướng", name: "Dê Nướng Chao", price: 135000, order_index: 20 },
  { category: "Các Món Nướng", name: "Dê Nướng Tảng", price: 200000, order_index: 21 },

  // ---- Các Món Lẩu ----
  { category: "Các Món Lẩu", name: "Lẩu Dê", price: 235000, order_index: 1, is_featured: true },
  { category: "Các Món Lẩu", name: "Lẩu Xí Quách", price: 235000, order_index: 2 },
  { category: "Các Món Lẩu", name: "Lẩu Thịt Tươi", price: 235000, order_index: 3 },
  { category: "Các Món Lẩu", name: "Lẩu Sườn Tươi", price: 235000, order_index: 4 },
  { category: "Các Món Lẩu", name: "Lẩu Cốt Lét", price: 235000, order_index: 5 },
  { category: "Các Món Lẩu", name: "Lẩu Dựng", price: 235000, order_index: 6 },
  { category: "Các Món Lẩu", name: "Lẩu Gối", price: 235000, order_index: 7 },
  { category: "Các Món Lẩu", name: "Lẩu Xương Ống", price: 235000, order_index: 8 },
  { category: "Các Món Lẩu", name: "Lẩu Thập Cẩm", price: 350000, order_index: 9, is_featured: true },
  { category: "Các Món Lẩu", name: "Lẩu Đầu Dê", price: 400000, order_index: 10, is_featured: true },
  { category: "Các Món Lẩu", name: "Lẩu Đầu + Xào Lăn", price: 450000, order_index: 11 },
  { category: "Các Món Lẩu", name: "Lẩu Đầu + Xào Sa Tế", price: 450000, order_index: 12 },
  { category: "Các Món Lẩu", name: "Lẩu Đuôi Dê", price: 235000, order_index: 13 },
  { category: "Các Món Lẩu", name: "Dê Nhúng Mẻ", price: 235000, order_index: 14 },
  { category: "Các Món Lẩu", name: "Cà Ri Dê", price: 235000, order_index: 15 },

  // ---- Các Món Thêm ----
  { category: "Các Món Thêm", name: "Rau Thêm", price: 15000, order_index: 1 },
  { category: "Các Món Thêm", name: "Phở", price: 10000, order_index: 2 },
  { category: "Các Món Thêm", name: "Mì", price: 10000, order_index: 3 },
  { category: "Các Món Thêm", name: "Đậu Hủ Non", price: 15000, order_index: 4 },
  { category: "Các Món Thêm", name: "Đậu Hủ Ký", price: 15000, order_index: 5 },
  { category: "Các Món Thêm", name: "Khoai Môn", price: 15000, order_index: 6 },
  { category: "Các Món Thêm", name: "Mắt Dê", price: 40000, order_index: 7 },
  { category: "Các Món Thêm", name: "Óc", price: 45000, order_index: 8 },
  { category: "Các Món Thêm", name: "Tủy", price: 45000, order_index: 9 },
  { category: "Các Món Thêm", name: "Óc Chưng Gừng", price: 50000, order_index: 10 },
  { category: "Các Món Thêm", name: "Óc Chưng Trứng", price: 60000, order_index: 11 },
  { category: "Các Món Thêm", name: "Óc Chiên Trứng", price: 60000, order_index: 12 },
  { category: "Các Món Thêm", name: "Nước Mắm Nhỉ (Chai)", price: 20000, order_index: 13 },
  { category: "Các Món Thêm", name: "Tủy Chưng Gừng", price: 50000, order_index: 14 },
  { category: "Các Món Thêm", name: "Tủy Chưng Trứng", price: 60000, order_index: 15 },
  { category: "Các Món Thêm", name: "Tủy Chiên Trứng", price: 60000, order_index: 16 },
  { category: "Các Món Thêm", name: "Xí Quách", price: 130000, order_index: 17 },
  { category: "Các Món Thêm", name: "Dựng Dê", price: 130000, order_index: 18 },
  { category: "Các Món Thêm", name: "Gối Dê", price: 130000, order_index: 19 },
  { category: "Các Món Thêm", name: "Xương Ống", price: 130000, order_index: 20 },
  { category: "Các Món Thêm", name: "Ngọc Dương Thêm", price: 350000, order_index: 21, description: "350k – 500k / bộ" },
  { category: "Các Món Thêm", name: "Thịt Lẩu", price: 130000, order_index: 22 },
  { category: "Các Món Thêm", name: "Thịt Tươi", price: 130000, order_index: 23 },
  { category: "Các Món Thêm", name: "Sườn Tươi", price: 130000, order_index: 24 },
  { category: "Các Món Thêm", name: "Cốt Lét", price: 130000, order_index: 25 },
  { category: "Các Món Thêm", name: "Đuôi Thêm", price: 130000, order_index: 26 },

  // ---- Tiết Canh ----
  { category: "Tiết Canh", name: "Tiết Canh Chén", price: 50000, order_index: 1 },
  { category: "Tiết Canh", name: "Tiết Canh Dĩa", price: 110000, order_index: 2 },
  { category: "Tiết Canh", name: "Tiết Canh Hấp", price: 110000, order_index: 3 },

  // ---- Các Món Khác ----
  { category: "Các Món Khác", name: "Rau Luộc Thập Cẩm Kho Quẹt", price: 90000, order_index: 1 },
  { category: "Các Món Khác", name: "Kho Quẹt", price: 50000, order_index: 2 },
  { category: "Các Món Khác", name: "Đậu Hủ Chiên Giòn", price: 50000, order_index: 3 },
  { category: "Các Món Khác", name: "Đậu Hủ Tẩm Hành", price: 50000, order_index: 4 },
  { category: "Các Món Khác", name: "Khoai Môn Lắc Bơ Mè", price: 60000, order_index: 5 },
  { category: "Các Món Khác", name: "Khoai Tây Chiên Giòn", price: 50000, order_index: 6 },
  { category: "Các Món Khác", name: "Cơm Chiên Dương Châu", price: 80000, order_index: 7 },
  { category: "Các Món Khác", name: "Cơm Chiên Cá Mặn", price: 80000, order_index: 8 },
  { category: "Các Món Khác", name: "Cánh Gà Chiên Nước Mắm", price: 80000, order_index: 9 },
  { category: "Các Món Khác", name: "Tóp Mỡ Cháy Tỏi", price: 80000, order_index: 10 },
  { category: "Các Món Khác", name: "Ếch Chiên Mắm", price: 80000, order_index: 11 },
  { category: "Các Món Khác", name: "Ếch Ủ Rôm", price: 80000, order_index: 12 },
  { category: "Các Món Khác", name: "Cánh Gà Chiên Mắm Khoai Môn", price: 80000, order_index: 13 },
  { category: "Các Món Khác", name: "Sụn Gà Chiên Mắm Khoai Môn", price: 80000, order_index: 14 },
  { category: "Các Món Khác", name: "Sụn Gà Rang Muối Hồng Kông", price: 80000, order_index: 15 },
  { category: "Các Món Khác", name: "Đậu Rồng Ướp Đá + Mắm Ruốc", price: 60000, order_index: 16 },
  { category: "Các Món Khác", name: "Rau Muống Xào Tỏi", price: 55000, order_index: 17 },
  { category: "Các Món Khác", name: "Cải Thìa Xào Tỏi", price: 60000, order_index: 18 },
  { category: "Các Món Khác", name: "Cải Thìa Sốt Nấm Đông Cô", price: 60000, order_index: 19 },
];

// ============================================================
// MENU VIP — Same categories, elevated pricing
// ============================================================
const VIP_DELTA: Record<string, number> = {
  "Các Món Dê": 30000,
  "Các Món Nướng": 30000,
  "Các Món Lẩu": 30000,
  "Các Món Thêm": 10000,
  "Tiết Canh": 30000,
  "Các Món Khác": 30000,
};

// Specific VIP overrides (items that have different prices in VIP vs regular)
const VIP_PRICE_OVERRIDES: Record<string, number> = {
  // Basic garnishes stay same or slightly higher in VIP
  "Rau Thêm": 25000,
  "Phở": 20000,
  "Mì": 20000,
  "Đậu Hủ Non": 25000,
  "Đậu Hủ Ký": 25000,
  "Khoai Môn": 25000,
  "Nước Mắm Nhỉ (Chai)": 30000,
};

const menuVip = menuThuong.map((item) => {
  const override = VIP_PRICE_OVERRIDES[item.name];
  const delta = VIP_DELTA[item.category] ?? 30000;
  const vipPrice = override !== undefined ? override : item.price + delta;
  return {
    ...item,
    price: vipPrice,
  };
});

async function main() {
  console.log("🌱 Starting seed...");

  // Hash password once for all admin users
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // ── Admin Users ──────────────────────────────────────────
  console.log("👤 Creating admin users...");
  for (const u of adminUsers) {
    await prisma.adminUser.upsert({
      where: { username: u.username },
      update: {},
      create: { username: u.username, password_hash: passwordHash },
    });
    console.log(`   ✔ ${u.username}`);
  }

  // ── Menu items — chỉ seed nếu DB chưa có data ──────────
  const existingMenuCount = await prisma.menuItem.count();
  if (existingMenuCount > 0) {
    console.log(`ℹ️  Menu đã có ${existingMenuCount} món — bỏ qua, không ghi đè.`);
  } else {
    // Thường
    console.log("🍽️  Seeding Menu Thường...");
    for (const item of menuThuong) {
      await prisma.menuItem.create({
        data: {
          menu_type: MenuType.thuong,
          category: item.category,
          name: item.name,
          price: String(item.price),
          description: (item as { description?: string }).description ?? null,
          is_featured: (item as { is_featured?: boolean }).is_featured ?? false,
          order_index: item.order_index,
        },
      });
    }
    console.log(`   ✔ ${menuThuong.length} items`);

    // VIP
    console.log("👑 Seeding Menu VIP...");
    for (const item of menuVip) {
      await prisma.menuItem.create({
        data: {
          menu_type: MenuType.vip,
          category: item.category,
          name: item.name,
          price: String(item.price),
          description: (item as { description?: string }).description ?? null,
          is_featured: (item as { is_featured?: boolean }).is_featured ?? false,
          order_index: item.order_index,
        },
      });
    }
    console.log(`   ✔ ${menuVip.length} items`);
  }

  // ── Contact Settings ─────────────────────────────────────
  console.log("📞 Creating contact settings...");
  const existingSettings = await prisma.contactSettings.findFirst();
  if (!existingSettings) {
    await prisma.contactSettings.create({
      data: {
        zalo_enabled: true,
        zalo_link: "",
        facebook_enabled: true,
        facebook_link: "",
        phone_enabled: true,
        phone_number: "",
        sms_enabled: true,
        sms_number: "",
        viber_enabled: false,
        viber_link: "",
      },
    });
    console.log("   ✔ Default contact settings created");
  } else {
    console.log("   ℹ  Contact settings already exist, skipping");
  }

  console.log("\n✅ Seed completed successfully!");
  console.log(`   Admin accounts: ${adminUsers.map((u) => u.username).join(", ")}`);
  console.log(`   Password: ${DEFAULT_PASSWORD}`);
  console.log(`   Menu Thường: ${menuThuong.length} items`);
  console.log(`   Menu VIP: ${menuVip.length} items`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

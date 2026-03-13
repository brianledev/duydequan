import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Sync images from one menu type to the other, matched by item name
export async function POST(req: NextRequest) {
  try {
    const { from, to } = await req.json();

    if (!from || !to || !["thuong", "vip"].includes(from) || !["thuong", "vip"].includes(to) || from === to) {
      return NextResponse.json({ error: "Invalid menu types" }, { status: 400 });
    }

    // Get all source items that have images
    const sourceItems = await prisma.menuItem.findMany({
      where: { menu_type: from, image: { not: null } },
      select: { name: true, image: true },
    });

    // Get all target items (with or without images)
    const targetItems = await prisma.menuItem.findMany({
      where: { menu_type: to },
      select: { id: true, name: true, image: true },
    });

    // Match by name (case-insensitive, trimmed)
    const normalize = (s: string) => s.trim().toLowerCase();
    const sourceMap = new Map<string, string>();
    for (const s of sourceItems) {
      if (s.image) sourceMap.set(normalize(s.name), s.image);
    }

    let synced = 0;
    for (const t of targetItems) {
      const sourceImage = sourceMap.get(normalize(t.name));
      // Only sync if target has no image and source has one
      if (sourceImage && !t.image) {
        await prisma.menuItem.update({
          where: { id: t.id },
          data: { image: sourceImage },
        });
        synced++;
      }
    }

    return NextResponse.json({
      synced,
      message: `Đã sync ảnh cho ${synced} món từ ${from === "thuong" ? "Thường" : "VIP"} sang ${to === "thuong" ? "Thường" : "VIP"}`,
    });
  } catch (error) {
    console.error("Sync images error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

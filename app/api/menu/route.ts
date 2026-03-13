import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const menuType = searchParams.get("type") as "thuong" | "vip" | null;
    const category = searchParams.get("category");

    const where: { menu_type?: "thuong" | "vip"; category?: string } = {};
    if (menuType) where.menu_type = menuType;
    if (category) where.category = category;

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: [{ category: "asc" }, { order_index: "asc" }],
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Menu fetch error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

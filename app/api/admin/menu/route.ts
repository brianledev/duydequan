import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const menuType = searchParams.get("type") as "thuong" | "vip" | null;
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: { menu_type?: "thuong" | "vip"; category?: string } = {};
    if (menuType) where.menu_type = menuType;
    if (category) where.category = category;

    const [items, total] = await prisma.$transaction([
      prisma.menuItem.findMany({
        where,
        orderBy: [{ category: "asc" }, { order_index: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.menuItem.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("Admin menu fetch error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { menu_type, category, name, description, price, image, order_index, is_featured } = body;

    if (!menu_type || !category || !name || !price) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({
      data: {
        menu_type,
        category,
        name,
        description: description || null,
        price,
        image: image || null,
        order_index: order_index || 0,
        is_featured: is_featured || false,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Create menu item error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

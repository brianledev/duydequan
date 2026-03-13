import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { menu_type, category, name, description, price, image, order_index, is_featured } = body;

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy món" }, { status: 404 });
    }

    // If image changed and old image was a blob URL, delete it
    if (image !== undefined && existing.image && existing.image !== image && existing.image.includes("blob.vercel-storage.com")) {
      try { await del(existing.image); } catch { /* ignore */ }
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        menu_type,
        category,
        name,
        description: description || null,
        price,
        image: image !== undefined ? (image || null) : existing.image,
        order_index: order_index ?? existing.order_index,
        is_featured: is_featured ?? existing.is_featured,
      },
    });

    await prisma.menuItemHistory.create({
      data: {
        action: "update",
        item_id: item.id,
        item_name: item.name,
        menu_type: item.menu_type,
        category: item.category,
        old_data: JSON.parse(JSON.stringify(existing)),
        new_data: JSON.parse(JSON.stringify(item)),
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Update menu item error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy món" }, { status: 404 });
    }

    // Delete blob image if exists
    if (existing.image && existing.image.includes("blob.vercel-storage.com")) {
      try { await del(existing.image); } catch { /* ignore */ }
    }

    await prisma.menuItemHistory.create({
      data: {
        action: "delete",
        item_id: existing.id,
        item_name: existing.name,
        menu_type: existing.menu_type,
        category: existing.category,
        old_data: JSON.parse(JSON.stringify(existing)),
      },
    });

    await prisma.menuItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete menu item error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

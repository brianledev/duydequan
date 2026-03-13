import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { history_id } = await req.json();
    if (!history_id) {
      return NextResponse.json({ error: "Thiếu history_id" }, { status: 400 });
    }

    const record = await prisma.menuItemHistory.findUnique({ where: { id: history_id } });
    if (!record) {
      return NextResponse.json({ error: "Không tìm thấy lịch sử" }, { status: 404 });
    }
    if (record.action !== "delete") {
      return NextResponse.json({ error: "Chỉ có thể khôi phục món đã xóa" }, { status: 400 });
    }

    const oldData = record.old_data as Record<string, unknown>;

    // Restore the item
    const restored = await prisma.menuItem.create({
      data: {
        menu_type: oldData.menu_type as "thuong" | "vip",
        category: oldData.category as string,
        name: oldData.name as string,
        description: (oldData.description as string) || null,
        price: oldData.price as string,
        image: (oldData.image as string) || null,
        order_index: (oldData.order_index as number) || 0,
        is_featured: (oldData.is_featured as boolean) || false,
      },
    });

    // Mark the original delete record as restored so button disappears
    await prisma.menuItemHistory.update({
      where: { id: history_id },
      data: { action: "restored" },
    });

    // Log restore as a new create entry
    await prisma.menuItemHistory.create({
      data: {
        action: "create",
        item_id: restored.id,
        item_name: restored.name,
        menu_type: restored.menu_type,
        category: restored.category,
        new_data: JSON.parse(JSON.stringify(restored)),
      },
    });

    return NextResponse.json({ item: restored });
  } catch (error) {
    console.error("Restore error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

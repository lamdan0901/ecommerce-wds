import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const prod = await db?.product.findFirst({
    where: { id },
    select: { filePath: true, name: true },
  });
  if (!prod) return notFound();

  const { size } = await fs.stat(prod.filePath);
  const file = await fs.readFile(prod.filePath);
  const ext = prod.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Length": size.toString(),
      "Content-Disposition": `attachment; filename="${prod.name}.${ext}"`,
    },
  });
}

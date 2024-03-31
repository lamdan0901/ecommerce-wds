import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import db from "@/db";

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  const data = await db?.downloadVerification.findUnique({
    where: {
      id: downloadVerificationId,
      expiresAt: { gt: new Date().getMilliseconds() },
    },
    select: { product: { select: { name: true, filePath: true } } },
  });
  if (!data)
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url)
    );

  const { size } = await fs.stat(data.product.filePath);
  const file = await fs.readFile(data.product.filePath);
  const ext = data.product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Length": size.toString(),
      "Content-Disposition": `attachment; filename="${data.product.name}.${ext}"`,
    },
  });
}

"use server";

import db from "@/db";
import { notFound } from "next/navigation";

export async function deleteOrder(id: string) {
  const order = await db?.order.delete({
    where: { id },
  });
  if (!order) return notFound();
  return order;
}
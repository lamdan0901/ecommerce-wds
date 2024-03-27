"use server";

import db from "@/db";
import { mkdir, writeFile } from "fs";
import { redirect } from "next/navigation";
import { z } from "zod";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/") // if file size = 0, it's not an image, otherwise, check if it's an image or not
);

const addSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1), // coerce will attempt to convert the value to a number
  description: z.string().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(formData: FormData) {
  const res = addSchema.safeParse(Object.entries(formData.entries()));
  if (!res.success) return res.error.formErrors.fieldErrors;

  const prod = res.data;

  await mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${prod.file.name}`;
  await writeFile(
    filePath,
    Buffer.from(await prod.file.arrayBuffer()),
    (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    }
  );

  await mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${prod.image.name}`; // public folder is for static files and can be accessed easily
  await writeFile(
    imagePath,
    Buffer.from(await prod.image.arrayBuffer()),
    (err) => {
      if (err) throw err;
      console.log("The image has been saved!");
    }
  );

  await db?.product.create({
    data: {
      name: prod.name,
      description: prod.description,
      priceInCents: prod.priceInCents,
      filePath,
      imagePath,
    },
  });

  redirect("/admin/products");
}

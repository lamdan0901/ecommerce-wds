"use server";

import db from "@/db";
import { mkdir, writeFile } from "fs";
import { unlink } from "fs/promises";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

// Cuz 'File' can only used in client side, not server side, so we use z.custom<File>() instead of z.instanceOf(File)
const fileSchema = z.custom<File>();
const imageSchema = fileSchema.refine(
  (file: File) => file.size === 0 || file.type.startsWith("image/") // if file size = 0, it's not an image, otherwise, check if it's an image or not
);

const addSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1), // coerce will attempt to convert the value to a number
  description: z.string().min(1),
  file: fileSchema.refine((file: File) => file.size > 0, "Required"),
  image: imageSchema.refine((file: File) => file.size > 0, "Required"),
});

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function addProduct(_prevState: unknown, formData: FormData) {
  const res = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!res.success) {
    return res.error.formErrors.fieldErrors;
  }

  const prod = res.data;

  await mkdir("products", () => ({ recursive: true }));
  const filePath = `products/${crypto.randomUUID()}-${prod.file.name}`;
  await writeFile(
    filePath,
    Buffer.from(await prod.file.arrayBuffer()),
    (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    }
  );

  await mkdir("public/products", () => ({ recursive: true }));
  const imagePath = `/products/${crypto.randomUUID()}-${prod.image.name}`; // public folder is for static files and can be accessed easily
  await writeFile(
    `public${imagePath}`,
    Buffer.from(await prod.image.arrayBuffer()),
    (err) => {
      if (err) throw err;
      console.log("The image has been saved!");
    }
  );

  await db?.product
    .create({
      data: {
        isAvailableForPurchase: false,
        name: prod.name,
        description: prod.description,
        priceInCents: prod.priceInCents,
        filePath,
        imagePath,
      },
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  // ! file name is not in utf-8

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: unknown,
  formData: FormData
) {
  const product = await db?.product.findFirst({
    where: { id },
  });
  if (!product) return notFound();

  const res = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!res.success) {
    return res.error.formErrors.fieldErrors;
  }

  const prod = res.data;

  let filePath = product.filePath;
  if (prod.file && prod.file.size > 0) {
    await unlink(filePath);
    filePath = `products/${crypto.randomUUID()}-${prod.file.name}`;
    await writeFile(
      filePath,
      Buffer.from(await prod.file.arrayBuffer()),
      (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      }
    );
  }

  let imagePath = product.imagePath;
  if (prod.image && prod.image.size > 0) {
    await unlink(`public${imagePath}`);
    imagePath = `/products/${crypto.randomUUID()}-${prod.image.name}`;
    await writeFile(
      `public${imagePath}`,
      Buffer.from(await prod.image.arrayBuffer()),
      (err) => {
        if (err) throw err;
        console.log("The image has been saved!");
      }
    );
  }

  await db?.product
    .update({
      where: { id },
      data: {
        name: prod.name,
        description: prod.description,
        priceInCents: prod.priceInCents,
        filePath,
        imagePath,
      },
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db?.product.update({
    where: { id },
    data: { isAvailableForPurchase },
  });

  revalidatePath("/");
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  const prod = await db?.product.delete({
    where: { id },
  });
  if (!prod) return notFound();

  revalidatePath("/");
  revalidatePath("/products");

  unlink(prod.imagePath);
  unlink(`public/${prod.filePath}`);
}

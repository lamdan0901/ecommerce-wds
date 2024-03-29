import React from "react";
import PageHeader from "../../../_components/PageHeader";
import ProductForm from "../../_components/ProductForm";

async function getProduct(id: string) {
  const product = await db?.product.findFirst({
    where: { id },
  });
  return product;
}

async function EditProductPage({ params: { id } }: { params: { id: string } }) {
  const product = await getProduct(id);
  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}

export default EditProductPage;

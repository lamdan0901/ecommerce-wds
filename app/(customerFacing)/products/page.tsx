import React, { Suspense } from "react";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db";
import { cache } from "@/lib/cache";

const getProducts = cache(async () => {
  await wait(2200);
  const products = await db?.product.findMany({
    where: { isAvailableForPurchase: true },
  });
  return products;
}, ["/products", "getProducts"]);

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

async function ProductPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        {(await getProducts()).map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </Suspense>
    </div>
  );
}

export default ProductPage;

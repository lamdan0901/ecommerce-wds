import React, { Suspense } from "react";
import db from "@/db";
import { Product } from "@prisma/client";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "../../components/ProductCard";
import { cache } from "../../lib/cache";

const getMostPopularProducts = cache(
  async () => {
    await wait(2200);
    const products = await db?.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
      take: 6,
    });
    return products;
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 } // 1 day
);

const getNewestProducts = cache(async () => {
  await wait(2200);
  const products = await db?.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });
  return products;
}, ["/", "getNewestProducts"]);

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        productsFetcher={getMostPopularProducts}
      />
      <ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
    </main>
  );
}

interface ProductGridSectionProps {
  title: string;
  productsFetcher: () => Promise<Product[]>;
}

async function ProductGridSection({
  title,
  productsFetcher,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant={"outline"} asChild>
          <Link href={"/products"} className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          {(await productsFetcher()).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}

export default HomePage;

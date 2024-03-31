import React from "react";
import ProductCard from "@/components/ProductCard";
import Stripe from "stripe";
import { notFound } from "next/navigation";
import db from "@/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function PurchaseSuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (!paymentIntent.metadata.product) return notFound();

  const product = await db?.product.findUnique({
    where: { id: paymentIntent.metadata.product },
  });
  if (!product) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="max-w-[350px] my-6">
      <h1 className="text-3xl mb-4">
        {isSuccess ? "Purchase Successful" : "Purchase Failed"}!
      </h1>
      <ProductCard noFooter {...product} />
      <Button className="mt-4" size={"lg"} asChild>
        {isSuccess ? (
          <a
            download={true}
            href={`/products/download/${await createDownloadVerification(
              product.id
            )}`}
          >
            Download
          </a>
        ) : (
          <Link href={`/products/${product.id}/purchase`}>Try again</Link>
        )}
      </Button>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  return (
    await db?.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).getMilliseconds(),
      },
    })
  ).id;
}

export default PurchaseSuccessPage;

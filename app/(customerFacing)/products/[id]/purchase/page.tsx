import React from "react";
import db from "@/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function getProduct(id: string) {
  const product = await db.product.findUnique({
    where: { id },
  });

  return product;
}

async function PurchasePage({ params: { id } }: { params: { id: string } }) {
  const product = await getProduct(id);
  if (!product) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "usd",
    metadata: {
      product: product.id,
    },
  });
  if (!paymentIntent.client_secret)
    throw new Error("Stripe failed to create payment intent");

  return (
    <CheckoutForm
      clientSecret={paymentIntent.client_secret}
      product={product}
    />
  );
}

export default PurchasePage;

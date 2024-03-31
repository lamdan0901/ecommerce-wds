"use client";

import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { formatCurrency } from "@/lib/formatters";
import { userOrderExists } from "@/app/actions/order";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface CheckoutFormProps {
  clientSecret: string;
  product: any;
}

function CheckoutForm({ clientSecret, product }: CheckoutFormProps) {
  return (
    <>
      <div className="max-w-[350px] mb-6">
        <ProductCard noFooter {...product} />
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
    </>
  );
}

function Form({
  priceInCents,
  productId,
}: {
  priceInCents: number;
  productId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements || !email) return;

    setIsPurchasing(true);

    const orderExists = await userOrderExists(email, productId);
    if (orderExists) {
      alert("You have already purchased this product.");
      setIsPurchasing(false);
      return;
    }

    return stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase`,
        },
      })
      .then(({ error }) => {
        if (error) {
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            setErrMsg(
              error.message ?? "An unexpected error occurred. Please try again."
            );
          } else {
            setErrMsg("An unexpected error occurred. Please try again.");
          }
        }
      })
      .finally(() => {
        setIsPurchasing(false);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="flex overflow-hidden flex-col">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className="text-destructive">
            {errMsg}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-3">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={!stripe || !elements || isPurchasing}
            size={"lg"}
            className="w-full"
          >
            {isPurchasing ? "Purchasing..." : "Purchase"} -{" "}
            {formatCurrency(priceInCents / 100)}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default CheckoutForm;

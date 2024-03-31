import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { formatCurrency } from "../lib/formatters";
import { Button } from "./ui/button";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
  noFooter?: boolean;
}

function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
  noFooter,
}: ProductCardProps) {
  return (
    <Card className="flex overflow-hidden flex-col">
      <div className="relative w-full h-auto aspect-video">
        <Image src={imagePath} alt={name} fill />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="line-clamp-4">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {formatCurrency(priceInCents / 100)}
      </CardContent>
      {!noFooter && (
        <CardFooter>
          <Button asChild size={"lg"} className="w-full">
            <Link href={`/products/${id}/purchase`}>Purchase</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="flex overflow-hidden flex-col">
      <div className="w-full aspect-video bg-gray-300"></div>
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300"></div>
        </CardTitle>
        <CardDescription className="line-clamp-4">
          <div className="w-1/2 h-4 rounded-full bg-gray-300"></div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="w-full h-4 rounded-full bg-gray-300"></div>
        <div className="w-full h-4 rounded-full bg-gray-300"></div>
        <div className="w-3/4 h-4 rounded-full bg-gray-300"></div>
      </CardContent>
      <CardFooter>
        <Button disabled size={"lg"} className="w-full"></Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;

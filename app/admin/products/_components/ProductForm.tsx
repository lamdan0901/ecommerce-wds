"use client";

import { useState } from "react";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { formatCurrency } from "../../../../lib/formatters";
import { Button } from "../../../../components/ui/button";
import { addProduct } from "../../_action/product";
import { useFormState, useFormStatus } from "react-dom";

function ProductForm() {
  const [error, action] = useFormState(addProduct, {});
  const { pending } = useFormStatus();
  const [priceInCents, setPriceInCents] = useState(0);

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" placeholder="Name" required />
        {error.name && <p className="text-destructive">{error.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">
          Price In Cents ({formatCurrency(priceInCents / 100)})
        </Label>
        <Input
          id="priceInCents"
          type="number"
          placeholder="Price In Cents"
          name="priceInCents"
          value={priceInCents}
          onChange={(e) => setPriceInCents(e.target.valueAsNumber || 0)}
          required
        />
        {error.priceInCents && (
          <p className="text-destructive">{error.priceInCents}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          type="text"
          placeholder="Description"
          required
        />
        {error.description && (
          <p className="text-destructive">{error.description}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input id="file" name="file" type="file" placeholder="File" required />
        {error.file && <p className="text-destructive">{error.file}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          placeholder="Image"
          required
        />
        {error.image && <p className="text-destructive">{error.image}</p>}
      </div>
      <Button disabled={pending} type="submit">
        Submit{pending ? "..." : ""}
      </Button>
    </form>
  );
}

export default ProductForm;

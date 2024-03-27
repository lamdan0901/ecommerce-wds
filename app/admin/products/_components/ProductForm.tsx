"use client";

import { useState } from "react";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { formatCurrency } from "../../../../lib/formatters";
import { Button } from "../../../../components/ui/button";
import { addProduct } from "../../_action/product";

function ProductForm() {
  const [priceInCents, setPriceInCents] = useState(0);

  return (
    <form action={addProduct} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" placeholder="Name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">
          Price In Cents - {formatCurrency(priceInCents / 100)}
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input id="file" name="file" type="file" placeholder="File" required />
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
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default ProductForm;

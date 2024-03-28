"use client";

import { useTransition } from "react";
import { DropdownMenuItem } from "../../../../components/ui/dropdown-menu";
import {
  deleteProduct,
  toggleProductAvailability,
} from "../../_action/product";

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggleProductAvailability() {
    startTransition(async () => {
      await toggleProductAvailability(id, !isAvailableForPurchase);
    });
  }

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={handleToggleProductAvailability}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteProduct(id);
    });
  }

  return (
    <DropdownMenuItem disabled={disabled || isPending} onClick={handleDelete}>
      Delete
    </DropdownMenuItem>
  );
}

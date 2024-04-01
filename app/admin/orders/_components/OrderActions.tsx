"use client";

import { useTransition } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { deleteOrder } from "../../_action/order";

export function DeleteDropdownItem({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteOrder(id);
      router.refresh();
    });
  }

  return (
    <DropdownMenuItem disabled={isPending} onClick={handleDelete}>
      Delete
    </DropdownMenuItem>
  );
}

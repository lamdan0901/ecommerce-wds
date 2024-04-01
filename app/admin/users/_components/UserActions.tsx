"use client";

import { useTransition } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { deleteUser } from "../../_action/user";

export function DeleteDropdownItem({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteUser(id);
      router.refresh();
    });
  }

  return (
    <DropdownMenuItem disabled={isPending} onClick={handleDelete}>
      Delete
    </DropdownMenuItem>
  );
}

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  children?: ReactNode;
};

export default function RadixDialog({ open, onOpenChange, title, children }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(96%,560px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 shadow-lg">
          {title && <Dialog.Title className="text-lg font-semibold mb-2">{title}</Dialog.Title>}
          <div>{children}</div>
          <Dialog.Close className="sr-only">Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

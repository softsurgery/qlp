import React from "react";
import { cn } from "../lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/sheet";
import { useRTL } from "./useRTL";

interface UseSheetOptions {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  onToggle?: () => void;
  side?: "top" | "right" | "bottom" | "left";
}

export function useSheet({
  children,
  title,
  description,
  className,
  onToggle,
  side,
}: UseSheetOptions) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isRTL } = useRTL();
  const resolvedSide = side ?? (isRTL ? "left" : "right");

  const openSheet = () => setIsOpen(true);
  const closeSheet = () => setIsOpen(false);

  const SheetFragment = (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) onToggle?.();
      }}
    >
      <SheetContent
        side={resolvedSide}
        className={cn("overflow-y-auto", className)}
      >
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        {children}
      </SheetContent>
    </Sheet>
  );

  return { SheetFragment, openSheet, closeSheet, isOpen };
}

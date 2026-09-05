import { useState } from "react";
import {
  cn,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@qlp/ui";

interface UseSheetOptions {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  onToggle?: () => void;
}

export function useSheet({
  children,
  title,
  description,
  className,
  onToggle,
}: UseSheetOptions) {
  const [isOpen, setIsOpen] = useState(false);

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
      <SheetContent className={cn("overflow-y-auto", className)}>
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

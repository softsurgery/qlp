import { type HTMLAttributes } from "react";
import { cn } from "@qlp/ui/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full max-w-md p-8 bg-card text-card-foreground rounded-xl shadow-lg border border-border",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-center mb-8", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("text-2xl font-bold text-primary", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm mt-1 text-muted-foreground", className)} {...props} />;
}

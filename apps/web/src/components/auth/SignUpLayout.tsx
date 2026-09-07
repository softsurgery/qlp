import { Link } from "react-router-dom";
import { cn } from "@qlp/ui";

interface SignUpLayoutProps {
  className?: string;
  brandName: string;
  brandIcon: React.ReactNode;
  toolbar?: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SignUpLayout({
  className,
  brandName,
  brandIcon,
  toolbar,
  title,
  description,
  children,
}: SignUpLayoutProps) {
  return (
    <div className={cn("flex min-h-svh flex-col bg-muted/40", className)}>
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-background/80 px-6 py-4 backdrop-blur">
        <Link to="/auth" className="flex items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            {brandIcon}
          </div>
          {brandName}
        </Link>
        {toolbar ? (
          <div className="flex items-center gap-2">{toolbar}</div>
        ) : null}
      </header>

      <main className="flex flex-1 justify-center px-6 py-10">
        <div className="flex w-full max-w-4xl flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

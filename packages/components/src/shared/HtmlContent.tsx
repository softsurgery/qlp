import { cn } from "@qlp/ui";

export interface HtmlContentProps {
  html?: string | null;
  className?: string;
}

function hasHtmlContent(html?: string | null) {
  if (!html) return false;
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0;
}

export function HtmlContent({ html, className }: HtmlContentProps) {
  if (!hasHtmlContent(html)) return null;

  return (
    <div
      className={cn(
        "text-sm leading-relaxed text-foreground/80 [&_a]:text-primary [&_a]:underline [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:font-semibold [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ps-5",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html! }}
    />
  );
}

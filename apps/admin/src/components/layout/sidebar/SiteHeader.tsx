import { useLocation } from "react-router-dom";
import { Separator } from "@qlp/ui";
import { SidebarTrigger } from "@qlp/ui/components/sidebar";

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/users", title: "Users" },
  { prefix: "/tutors", title: "Tutor Verification" },
  { prefix: "/curriculum", title: "Curriculum" },
];

export function SiteHeader() {
  const { pathname } = useLocation();
  const title =
    TITLES.find((item) => pathname.startsWith(item.prefix))?.title ??
    "Dashboard";

  return (
    <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  );
}

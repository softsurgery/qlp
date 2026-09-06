import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ModeToggle, Separator } from "@qlp/ui";
import { SidebarTrigger } from "@qlp/ui/components/sidebar";

const TITLES: { prefix: string; key: string }[] = [
  { prefix: "/curriculum", key: "nav.curriculum" },
  { prefix: "/tutors", key: "nav.tutors" },
  { prefix: "/bookings", key: "nav.bookings" },
  { prefix: "/chat", key: "nav.chat" },
  { prefix: "/achievements", key: "nav.achievements" },
  { prefix: "/profile", key: "nav.profile" },
  { prefix: "/children", key: "nav.children" },
  { prefix: "/lessons", key: "nav.curriculum" },
  { prefix: "/video", key: "nav.bookings" },
];

export function SiteHeader() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const titleKey =
    TITLES.find((item) => pathname.startsWith(item.prefix))?.key ??
    "nav.dashboard";

  return (
    <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-base font-medium">{t(titleKey)}</h1>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

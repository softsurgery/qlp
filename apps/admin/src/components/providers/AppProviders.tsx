import { useMemo, useState } from "react";
import {
  BreadcrumbContext,
  FooterContext,
  IntroContext,
  UIContext,
  type BreadcrumbRoute,
} from "@qlp/contexts";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [footer, setFooter] = useState<React.ReactNode>(null);
  const [routes, setRoutes] = useState<BreadcrumbRoute[]>([]);
  const [intro, setIntroState] = useState({ title: "", description: "" });
  const [floating, setFloating] = useState<React.ReactNode>(null);
  const [enableMainOverflow, setEnableMainOverflow] = useState(false);

  const footerValue = useMemo(
    () => ({
      content: footer,
      setContent: setFooter,
      clearContent: () => setFooter(null),
    }),
    [footer],
  );

  const breadcrumbValue = useMemo(
    () => ({
      routes,
      setRoutes,
      clearRoutes: () => setRoutes([]),
    }),
    [routes],
  );

  const introValue = useMemo(
    () => ({
      title: intro.title,
      description: intro.description,
      floating,
      setIntro: (title: string, description: string) =>
        setIntroState({ title, description }),
      setFloating,
      clearIntro: () => setIntroState({ title: "", description: "" }),
      clearFloating: () => setFloating(null),
    }),
    [floating, intro.description, intro.title],
  );

  const uiValue = useMemo(
    () => ({
      enableMainOverflow,
      setEnableMainOverflow,
      clearEnableMainOverflow: () => setEnableMainOverflow(false),
    }),
    [enableMainOverflow],
  );

  return (
    <UIContext.Provider value={uiValue}>
      <BreadcrumbContext.Provider value={breadcrumbValue}>
        <IntroContext.Provider value={introValue}>
          <FooterContext.Provider value={footerValue}>
            {children}
          </FooterContext.Provider>
        </IntroContext.Provider>
      </BreadcrumbContext.Provider>
    </UIContext.Provider>
  );
}

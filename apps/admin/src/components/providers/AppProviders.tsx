import { useCallback, useMemo, useState } from "react";
import {
  BreadcrumbContext,
  FooterContext,
  IntroContext,
  UIProvider,
  type BreadcrumbRoute,
} from "@qlp/contexts";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [footer, setFooter] = useState<React.ReactNode>(null);
  const [routes, setRoutes] = useState<BreadcrumbRoute[]>([]);
  const [intro, setIntroState] = useState({ title: "", description: "" });
  const [floating, setFloating] = useState<React.ReactNode>(null);

  const clearContent = useCallback(() => setFooter(null), []);
  const clearRoutes = useCallback(() => setRoutes([]), []);
  const setIntro = useCallback((title: string, description: string) => {
    setIntroState((prev) =>
      prev.title === title && prev.description === description
        ? prev
        : { title, description },
    );
  }, []);
  const clearIntro = useCallback(() => {
    setIntroState((prev) =>
      prev.title === "" && prev.description === ""
        ? prev
        : { title: "", description: "" },
    );
  }, []);
  const clearFloating = useCallback(() => setFloating(null), []);

  const footerValue = useMemo(
    () => ({
      content: footer,
      setContent: setFooter,
      clearContent,
    }),
    [clearContent, footer],
  );

  const breadcrumbValue = useMemo(
    () => ({
      routes,
      setRoutes,
      clearRoutes,
    }),
    [clearRoutes, routes],
  );

  const introValue = useMemo(
    () => ({
      title: intro.title,
      description: intro.description,
      floating,
      setIntro,
      setFloating,
      clearIntro,
      clearFloating,
    }),
    [clearFloating, clearIntro, floating, intro.description, intro.title, setIntro],
  );

  return (
    <UIProvider>
      <BreadcrumbContext.Provider value={breadcrumbValue}>
        <IntroContext.Provider value={introValue}>
          <FooterContext.Provider value={footerValue}>
            {children}
          </FooterContext.Provider>
        </IntroContext.Provider>
      </BreadcrumbContext.Provider>
    </UIProvider>
  );
}

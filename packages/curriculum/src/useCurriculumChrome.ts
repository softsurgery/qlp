import { useEffect } from "react";
import { useBreadcrumb, useIntro, useUI, type BreadcrumbRoute } from "@qlp/contexts";

export function useCurriculumChrome(
  title: string,
  description: string,
  routes: BreadcrumbRoute[],
  overflow = true,
) {
  const { setIntro, clearIntro } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setEnableMainOverflow, clearEnableMainOverflow } = useUI();

  useEffect(() => {
    setIntro?.(title, description);
    setRoutes?.(routes);
    setEnableMainOverflow?.(overflow);
    return () => {
      clearIntro?.();
      clearRoutes?.();
      clearEnableMainOverflow?.();
    };
    // routes is derived from title/description translations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clearEnableMainOverflow,
    clearIntro,
    clearRoutes,
    description,
    overflow,
    setEnableMainOverflow,
    setIntro,
    setRoutes,
    title,
  ]);
}

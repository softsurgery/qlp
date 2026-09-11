import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useBreadcrumb } from "@qlp/contexts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@qlp/ui";

export function BreadcrumbCommon() {
  const { routes } = useBreadcrumb();
  if (!routes?.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {routes.map((route, index) => {
          const isLast = index === routes.length - 1;

          return (
            <Fragment key={`${route.title}-${route.href ?? index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {route.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link to={route.href}>{route.title}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{route.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

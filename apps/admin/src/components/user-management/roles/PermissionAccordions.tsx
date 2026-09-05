import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Toggle,
} from "@qlp/ui";
import type { ResponsePermissionDto } from "@qlp/api-client";
import { useRoleStore } from "@/hooks/stores/useRoleStore";
import { sortedGroupedPermissions } from "./grouped-permissions";
import { formatPermissionLabel } from "./utils";

interface PermissionAccordionsProps {
  permissions?: ResponsePermissionDto[];
  type: "create" | "update";
}

export const PermissionAccordions = ({
  permissions,
  type,
}: PermissionAccordionsProps) => {
  const roleStore = useRoleStore();
  const { t } = useTranslation("role");

  if (!permissions) return null;

  return (
    <Accordion type="multiple" className="mt-0 w-full">
      {Object.entries(sortedGroupedPermissions(permissions)).map(
        ([entity, grouped]) => (
          <AccordionItem key={entity} value={entity}>
            <AccordionTrigger className="py-2 text-sm font-extrabold">
              {t(`role.permissions.entities.${entity}`, {
                defaultValue: formatPermissionLabel(entity),
              })}
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <div className="mt-2 grid grid-cols-2 gap-2">
                {grouped.map((permission) => {
                  const isSelected = roleStore.isPermissionSelected(
                    permission.id?.toString() || "",
                    type,
                  );
                  return (
                    <Toggle
                      key={permission.id}
                      pressed={isSelected}
                      value={permission.id?.toString()}
                      onPressedChange={(pressed) => {
                        if (!pressed) {
                          roleStore.removePermission(
                            permission.id?.toString() || "",
                            type,
                          );
                        } else {
                          roleStore.addPermission(permission, type);
                        }
                      }}
                      className="border"
                    >
                      {t(`role.permissions.labels.${permission.label}`, {
                        defaultValue: formatPermissionLabel(permission.label),
                      })}
                    </Toggle>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ),
      )}
    </Accordion>
  );
};

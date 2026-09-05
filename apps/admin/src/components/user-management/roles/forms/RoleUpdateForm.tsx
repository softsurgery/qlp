import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { Button } from "@qlp/ui";
import { cn } from "@/lib/utils";
import { useRoleStore } from "@/hooks/stores/useRoleStore";
import { usePermissions } from "@/hooks/usePermissions";
import { useUpdateRoleFormStructure } from "./useUpdateRoleFormStructure";

interface RoleFormProps {
  className?: string;
  roleCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const RoleUpdateForm = ({
  className,
  roleCallback,
  cancelCallback,
  isPending,
}: RoleFormProps) => {
  const roleStore = useRoleStore();
  const { permissions } = usePermissions();
  const { t: tCommon } = useTranslation("common");
  const { roleUpdateFormStructure } = useUpdateRoleFormStructure({
    roleStore,
    permissions,
  });

  return (
    <div className={cn("flex flex-1 flex-col gap-2 overflow-hidden", className)}>
      <FormBuilder
        className="mx-auto flex h-full flex-1 flex-col overflow-auto"
        structure={roleUpdateFormStructure}
      />
      <div className="flex justify-end gap-2 border-t px-4 py-3">
        <Button onClick={roleCallback} disabled={isPending}>
          <Save />
          {tCommon("commands.save")}
        </Button>
        <Button variant="secondary" onClick={cancelCallback} disabled={isPending}>
          {tCommon("commands.cancel")}
        </Button>
      </div>
    </div>
  );
};

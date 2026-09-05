import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import { FormBuilder } from "@qlp/form-builder";
import { Button } from "@qlp/ui";
import { cn } from "@/lib/utils";
import { useRoleStore } from "@/hooks/stores/useRoleStore";
import { usePermissions } from "@/hooks/usePermissions";
import { useCreateRoleFormStructure } from "./useCreateRoleFormStructure";

interface RoleFormProps {
  className?: string;
  roleCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const RoleCreateForm = ({
  className,
  roleCallback,
  cancelCallback,
  isPending,
}: RoleFormProps) => {
  const roleStore = useRoleStore();
  const { permissions } = usePermissions();
  const { t: tCommon } = useTranslation("common");
  const { roleCreateFormStructure } = useCreateRoleFormStructure({
    roleStore,
    permissions,
  });

  return (
    <div className={cn("flex flex-1 flex-col gap-2 overflow-hidden", className)}>
      <FormBuilder
        className="mx-auto flex h-full flex-1 flex-col overflow-auto"
        structure={roleCreateFormStructure}
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

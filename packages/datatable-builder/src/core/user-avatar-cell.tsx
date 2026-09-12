import React from "react";
import { useApp } from "@qlp/contexts";
import { useUploadSrc } from "@qlp/hooks";
import { IdentifiableUser, identifyUser, identifyUserAvatar } from "@qlp/lib";
import DataTableCell from "./data-table-cell";
import { DataTableCellVariant } from "../types";

export const UserAvatarCell = ({ user }: { user: IdentifiableUser }) => {
  const { api } = useApp();
  const { data: src } = useUploadSrc(
    user?.picture ?? (user?.pictureId ? { id: user?.pictureId } : null),
    api.upload,
  );

  return (
    <DataTableCell
      variant={DataTableCellVariant.AVATAR}
      value={
        user
          ? {
              src: src || undefined,
              fallback: identifyUserAvatar(user),
              label: identifyUser(user),
            }
          : { label: "-" }
      }
    />
  );
};

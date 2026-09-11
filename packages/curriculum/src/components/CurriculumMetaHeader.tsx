import React from "react";
import { useTranslation } from "react-i18next";
import { type ResponseUserDto } from "@qlp/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "@qlp/ui";
import { useUploadSrc, type UploadSrcApi } from "@qlp/hooks";
import { DocumentMetaTable, type MetaTableRow } from "./DocumentMetaTable";

export interface CurriculumMetaHeaderProps {
  className?: string;
  statusLabel?: string;
  status: string;
  createdByLabel?: string;
  user?: ResponseUserDto | null;
  createdAtLabel?: string;
  createdAt?: Date | string;
  updatedAtLabel?: string;
  updatedAt?: Date | string;
  extraRows?: MetaTableRow[];
  uploadApi?: UploadSrcApi;
}

export const CurriculumMetaHeader = ({
  className,
  statusLabel,
  status,
  createdByLabel,
  user,
  createdAtLabel,
  createdAt,
  updatedAtLabel,
  updatedAt,
  extraRows = [],
  uploadApi,
}: CurriculumMetaHeaderProps) => {
  const { t: tCommon } = useTranslation("common");

  const { data: avatarSrc } = useUploadSrc(
    uploadApi ? (user?.picture ?? (user?.pictureId ? { id: user.pictureId } : null)) : null,
    uploadApi!
  );

  const formatDate = (date?: Date | string) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  };

  const rows: MetaTableRow[] = [
    { label: statusLabel || tCommon("fields.status", "Status"), value: status },
    ...(user
      ? [
          {
            label: createdByLabel || tCommon("fields.createdBy", "Created By"),
            value: (
              <div className="flex items-center gap-2">
                {uploadApi && (
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={avatarSrc ?? undefined} />
                    <AvatarFallback className="text-[10px]">
                      {(user.firstName?.[0] || user.username[0] || "?").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span>
                  {user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </span>
              </div>
            ),
          },
        ]
      : []),
    ...(createdAt
      ? [
          {
            label: createdAtLabel || tCommon("fields.createdAt", "Created At"),
            value: formatDate(createdAt),
          },
        ]
      : []),
    ...(updatedAt
      ? [
          {
            label: updatedAtLabel || tCommon("fields.updatedAt", "Updated At"),
            value: formatDate(updatedAt),
          },
        ]
      : []),
    ...extraRows,
  ];

  return <DocumentMetaTable rows={rows} className={className} />;
};

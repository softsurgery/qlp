import { useTranslation } from "react-i18next";
import { type ResponseCurriculumDto } from "@qlp/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "@qlp/ui";
import { useUploadSrc, type UploadSrcApi } from "@qlp/hooks";
import { DocumentMetaTable, type MetaTableRow } from "@qlp/components";
import { identifyUser, identifyUserAvatar } from "@qlp/lib";

export interface CurriculumMetaHeaderProps {
  className?: string;
  curriculum?: Partial<ResponseCurriculumDto>;
  extraRows?: MetaTableRow[];
  uploadApi?: UploadSrcApi;
}

export const CurriculumMetaHeader = ({
  className,
  curriculum,
  extraRows = [],
  uploadApi,
}: CurriculumMetaHeaderProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const { t: tCurriculum } = useTranslation(["curriculum-common", "global", "curriculum-lesson", "curriculum-module", "curriculum-material"]);

  const createdBy = curriculum?.createdBy;
  const owner = curriculum?.owner;
  const status = curriculum?.status;
  const createdAt = curriculum?.createdAt;
  const updatedAt = curriculum?.updatedAt;

  const { data: createdByAvatarSrc } = useUploadSrc(
    uploadApi
      ? (createdBy?.picture ??
          (createdBy?.pictureId ? { id: createdBy?.pictureId } : null))
      : null,
    uploadApi!,
  );

  const { data: ownerAvatarSrc } = useUploadSrc(
    uploadApi
      ? (owner?.picture ?? (owner?.pictureId ? { id: owner?.pictureId } : null))
      : null,
    uploadApi!,
  );

  const formatDate = (date?: Date | string) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  };

  const rows: MetaTableRow[] = [
    ...(status
      ? [
          {
            label: tCommon("fields.status"),
            value: tCurriculum(`status.${String(status).toLowerCase()}` as any, status),
          },
        ]
      : []),
    ...(createdBy
      ? [
          {
            label: tCommon("fields.createdBy"),
            value: (
              <div className="flex items-center gap-2">
                {uploadApi && (
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={createdByAvatarSrc ?? undefined} />
                    <AvatarFallback className="text-[10px]">
                      {(
                        createdBy.firstName?.[0] ||
                        createdBy.username[0] ||
                        "?"
                      ).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span>{identifyUser(createdBy)}</span>
              </div>
            ),
          },
        ]
      : []),
    ...(owner
      ? [
          {
            label: tCommon("fields.owner"),
            value: (
              <div className="flex items-center gap-2">
                {uploadApi && (
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={ownerAvatarSrc ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {identifyUserAvatar(owner)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span>{identifyUser(owner)}</span>
              </div>
            ),
          },
        ]
      : []),
    ...(createdAt
      ? [
          {
            label: tCommon("fields.createdAt"),
            value: formatDate(createdAt),
          },
        ]
      : []),
    ...(updatedAt
      ? [
          {
            label: tCommon("fields.updatedAt"),
            value: formatDate(updatedAt),
          },
        ]
      : []),
    ...extraRows,
  ];

  return <DocumentMetaTable rows={rows} className={className} />;
};

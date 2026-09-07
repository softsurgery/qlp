import { Avatar, AvatarFallback, AvatarImage } from "@qlp/ui";
import type { Upload } from "@qlp/api-client";
import { useUploadSrc } from "@qlp/hooks";
import { api } from "@/lib/api";

interface UserAvatarCellProps {
  pictureId?: number;
  picture?: Upload;
  fallback: string;
}

export default function UserAvatarCell({
  pictureId,
  picture,
  fallback,
}: UserAvatarCellProps) {
  const { data: src } = useUploadSrc(
    picture ?? (pictureId ? { id: pictureId } : null),
    api.upload,
  );

  return (
    <Avatar className="size-8">
      <AvatarImage src={src} alt={fallback} />
      <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
    </Avatar>
  );
}

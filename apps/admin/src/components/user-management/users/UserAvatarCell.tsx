import { Avatar, AvatarFallback } from "@qlp/ui";

interface UserAvatarCellProps {
  pictureId?: number;
  fallback: string;
}

export default function UserAvatarCell({ fallback }: UserAvatarCellProps) {
  return (
    <Avatar className="size-8">
      <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
    </Avatar>
  );
}

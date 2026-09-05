import type { ResponseUserDto } from "@qlp/api-client";

export function identifyUser(user?: Partial<ResponseUserDto> | null) {
  if (!user) return "Unknown";
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username || user.email || "Unknown";
}

export function identifyUserAvatar(user?: Partial<ResponseUserDto> | null) {
  if (!user) return "U";
  const first = user.firstName?.charAt(0);
  const last = user.lastName?.charAt(0);
  if (first || last) return `${first ?? ""}${last ?? ""}`.toUpperCase();
  return (user.username || user.email || "U").charAt(0).toUpperCase();
}

import type { ResponsePermissionDto } from "@qlp/api-client";

export const groupedPermissions = (
  permissions: ResponsePermissionDto[],
): Record<string, ResponsePermissionDto[]> =>
  permissions.reduce<Record<string, ResponsePermissionDto[]>>(
    (groups, permission) => {
      const [, ...rest] = permission.label?.split("_") || [];
      const entity = rest.join("_");
      if (!groups[entity]) groups[entity] = [];
      groups[entity].push(permission);
      return groups;
    },
    {},
  );

export const sortedGroupedPermissions = (permissions: ResponsePermissionDto[]) =>
  Object.entries(groupedPermissions(permissions) || {})
    .sort(([entityA], [entityB]) => entityA.localeCompare(entityB))
    .reduce(
      (sortedGroups, [entity, grouped]) => {
        sortedGroups[entity] = grouped;
        return sortedGroups;
      },
      {} as Record<string, ResponsePermissionDto[]>,
    );

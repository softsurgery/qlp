import { BasicRoles } from 'src/shared/abstract-user-management/enums/basic-roles.enum';

export const MEDIA_PRIVILEGED_ROLE_IDS: readonly string[] = [BasicRoles.Admin];

export const MEDIA_HOST_CAPABLE_ROLE_IDS: readonly string[] = [
  BasicRoles.Admin,
  BasicRoles.Tutor,
];

export const MEDIA_ROOM_NAME_PREFIX = 'qlp';

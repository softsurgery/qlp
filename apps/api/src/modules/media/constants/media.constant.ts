import { ExtendedRoles } from 'src/modules/user-management/enums/extended-roles.enum';
import { BasicRoles } from 'src/shared/abstract-user-management/enums/basic-roles.enum';

export const MEDIA_PRIVILEGED_ROLE_IDS: readonly string[] = [BasicRoles.Admin];

export const MEDIA_HOST_CAPABLE_ROLE_IDS: readonly string[] = [
  BasicRoles.Admin,
  ExtendedRoles.Tutor,
];

export const MEDIA_ROOM_NAME_PREFIX = 'qlp';

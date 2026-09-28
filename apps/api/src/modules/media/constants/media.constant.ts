import { ExtendedRoles } from 'src/modules/user-management/enums/extended-roles.enum';
import { BasicRoles } from 'src/shared/abstract-user-management/enums/basic-roles.enum';

// Admins create sessions, assign their host and can do anything to any session.
export const MEDIA_PRIVILEGED_ROLE_IDS: readonly string[] = [BasicRoles.Admin];

// Roles that may schedule their own sessions, or be assigned as host by an admin.
export const MEDIA_HOST_CAPABLE_ROLE_IDS: readonly string[] = [ExtendedRoles.Tutor];

// Roles a host may invite. Admins may invite anyone.
export const MEDIA_INVITABLE_ROLE_IDS: readonly string[] = [ExtendedRoles.Student];

export const MEDIA_ROOM_NAME_PREFIX = 'qlp';

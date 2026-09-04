import { Gender } from 'src/modules/user-management/enums/gender.enum';
import { BasicRoles } from 'src/shared/abstract-user-management/enums/basic-roles.enum';

export const adminSeed = {
  core: {
    id: 'superadmin',
    firstName: 'SUPER$',
    lastName: 'SUPER$',
    username: 'superadmin',
    email: 'superadmin@example.com',
    password: 'superpassword',
    roleId: BasicRoles.Admin,
    isActive: true,
  },
  extended: {
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    gender: Gender.Male,
  },
};

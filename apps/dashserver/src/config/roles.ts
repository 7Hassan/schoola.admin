import { allAccessRights, defaultAccessRights, IAccessRight, moderationAccessRights } from './accessRights';

interface IRole {
  name: string;
  accessRights: IAccessRight[];
}

const userRole: IRole = {
  name: 'user',
  accessRights: defaultAccessRights,
};

const adminRole: IRole = {
  name: 'admin',
  accessRights: moderationAccessRights,
};

const superAdminRole: IRole = {
  name: 'super-admin',
  accessRights: allAccessRights,
};

export { userRole, adminRole, superAdminRole };

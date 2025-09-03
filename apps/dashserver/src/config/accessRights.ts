enum EResource {
  Courses = 'courses',
  Students = 'students',
  Teachers = 'teachers',
  Locations = 'locations',
  Groups = 'groups',
  Payments = 'payments',
  Authorities = 'authorities',
  Discounts = 'discounts',
}

enum EPermission {
  Read = 'read',
  Write = 'write',
  Delete = 'delete',
}

interface IAccessRight {
  resource: EResource;
  permissions: {
    [key in EPermission]: boolean;
  };
}

const allResources = Object.values(EResource);

const moderationAccessRights: IAccessRight[] = allResources.map((resource) => ({
  resource,
  permissions: {
    [EPermission.Read]: true,
    [EPermission.Write]: true,
    [EPermission.Delete]: false,
  },
}));

const readOnlyAccess: IAccessRight[] = allResources.map((resource) => ({
  resource,
  permissions: {
    [EPermission.Read]: true,
    [EPermission.Write]: false,
    [EPermission.Delete]: false,
  },
}));

const defaultAccessRights: IAccessRight[] = allResources.map((resource) => ({
  resource,
  permissions: {
    [EPermission.Read]: false,
    [EPermission.Write]: false,
    [EPermission.Delete]: false,
  },
}));

const allAccessRights: IAccessRight[] = allResources.map((resource) => ({
  resource,
  permissions: {
    [EPermission.Read]: true,
    [EPermission.Write]: true,
    [EPermission.Delete]: true,
  },
}));

export {
  defaultAccessRights,
  allAccessRights,
  readOnlyAccess,
  moderationAccessRights,
  IAccessRight,
  EResource,
  EPermission,
};

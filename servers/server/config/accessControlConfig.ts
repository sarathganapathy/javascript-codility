import { Permissions, Role, Access } from "../middleware/accessControl";
import { Routes } from "../types/util";

const permissions: Permissions = {
    // main routes
    [Routes.User]: {
        [Role.User]: [Access.Read, Access.Create, Access.Update],
        [Role.Manager]: [Access.Read],
        [Role.Admin]: [Access.Read, Access.Create, Access.Update, Access.Delete]
    },
    [Routes.Result]: {
        [Role.User]: [Access.Read],
        [Role.Manager]: [Access.Read, Access.Create, Access.Update],
        [Role.Admin]: [Access.Read, Access.Create, Access.Update, Access.Delete],
    },
    [Routes.Event]: {
        [Role.User]: [Access.Read],
        [Role.Manager]: [Access.Read, Access.Create, Access.Update, Access.Delete],
        [Role.Admin]: [Access.Read, Access.Create, Access.Update, Access.Delete],
    },
    [Routes.Problem]: {
        [Role.User]: [Access.Read],
        [Role.Manager]: [Access.Read, Access.Create, Access.Update, Access.Delete],
        [Role.Admin]: [Access.Read, Access.Create, Access.Update, Access.Delete],
    },
    // sub routes
    [`${Routes.User}/userControl`]: {
        [Role.User]: [],
        [Role.Manager]: [],
        [Role.Admin]: [Access.Update],
    }
};

export default permissions;
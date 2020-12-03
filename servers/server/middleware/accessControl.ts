import { Request, Response, NextFunction } from "express";

/**
 * @interface
 * @def interface for roles
 */
export enum Role {
    User = "User",
    Manager = "Manager",
    Admin = "Admin"
}

/**
 * @interface
 * @def interface for access
 */
export enum Access {
    Read = "Read",
    Create = "Create",
    Update = "Update",
    Delete = "Delete"
}

/**
 * @interface
 * @def interface for operations
 */
export enum Operations {
    Read = "Read",
    Create = "Create",
    Update = "Update",
    Delete = "Delete"
}

/**
 * @interface
 * @def interface for Permission
 * The Permission should be in below format
 * {
 *   ["route<event>"]: {
 *      ["role<user>"]: [Access.Read, Access.Create, Access.Update],
 *      ["role<manager>"]: [Access.Read, Access.Create],
 *      [role<admin>]: [Access.Read, Access.Create, Access.Update, Access.Delete]
 *   },
 */
export interface Permissions {
    [key: string]: {
        [key: string]: string[]
    };
}

/**
 * Function to check the route request is made by user to update user data
 * User route should be validated such that, users should not have access to modify other users
 * @param route route name
 * @param role role of user
 * @returns returns boolean value
 */
const isUserRouteByUnauthorized = (route: string, role: string) => route === "user" && role === Role.User;

/**
 * @def Middleware to check whether user has access to perform operations
 * @param permission - permission object
 * @returns Function which returns middleware
 */
export const generateAccess = (permission: Permissions) => (route: string, operation: keyof typeof Operations) =>
    (request: Request, response: Response, next: NextFunction): void => {
        const error = {
            status: {
                flag: "F",
                message: 'Unauthorized user: no access'
            }
        };
        const { role, username } = request.user && request.user as any || {};
        if (!role) {
            response.status(401).json(error);
            return;
        }
        const hasUserAccess = !isUserRouteByUnauthorized(route, role)
            ? permission[route][role].indexOf(String(operation)) !== -1
            : permission[route][role].indexOf(String(operation)) !== -1
            && request.params.userId === username;
        if (hasUserAccess) {
            return next(); // continue to next middleware
        }
        response.status(401).json(error);
    };

import { Document } from "mongoose";

/**
 * @def enum for roles
 * @enum
 */
export enum Role {
    Admin = "Admin",
    Manager = "Manager",
    User = "User"
}

/**
 * @def enum for gender
 * @enum
 */
export enum Gender {
    Female = "F",
    Male = "M"
}

/**
 * @def interface for user schema
 * @interface
 */
export interface User {
    activeStatus: boolean;
    email: string;
    firstName: string;
    gender: Gender;
    hasEmailVerified: boolean;
    lastName?: string;
    phoneNo?: string;
    password: string;
    role: Role;
    username: string;
}

/**
 * @def interface for user response object
 * @interface
 */
export interface ResponseObject extends Omit<User, 'password'> {
}

/**
 * @def interface for user request object
 * @interface
 */
export interface FilteredUserData {
    email: string;
    firstName: string;
    gender: Gender;
    lastName?: string;
    password: string;
    username: string;
}

/**
 * @def interface for user control request object
 * @interface
 */
export interface FilteredUserControlData {
    activeStatus: boolean;
    hasEmailVerified: boolean;
    role: Role;
}

/**
 * @def interface for user response object
 * @interface
 */
export interface UserResponseObject {
    user: ResponseObject;
}

/**
 * @def interface for all user response object
 * @interface
 */
export interface UserResponseObjects {
    count: number;
    users: ResponseObject[];
}

/**
 * @def interface for user document
 * @interface
 */
export interface UserDocument extends User, Document {
    comparePassword(password: string): Promise<boolean>;
}

/**
 * @interface
 * @def interface for problem request params
 */
export interface UserParams {
    userId: string;
}

/**
 * @interface
 * @def interface for problem queries
 */
export interface UserQueries {
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
}
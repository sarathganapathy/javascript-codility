import User from "../../models/user";
import logger from "../../logger";
import { errorMessage } from "../../../sharedUtils/utils";
import { QueryFlags, ParamsDictionary, ParsedQs, QueryStatus } from "../../types/util";
import {
    FilteredUserControlData,
    FilteredUserData,
    User as IUser,
    UserDocument,
    UserResponseObject,
    UserResponseObjects,
    UserParams,
    UserQueries
} from "../../types/user";

// exclude id and hashed password ("fileName" - include, "-fieldName" - exclude)
const excludeFields = "-_id -password";

/**
 * return the users as promise object.
 * @param params - extracted request params
 * @param query - extracted request query
 * @return  users
 */
export const getAllUsers = async (params: null, query: UserQueries)
    : Promise<UserResponseObjects> | never => {
    try {
        const users: IUser[] = await User.find(query)
            .select(excludeFields)
            .lean()
            .exec();
        return ({
            count: users.length,
            users
        });
    } catch (error) {
        logger.error("user controller:: getAllUsers", error);
        throw error;
    }
};

/**
 * creates the user as document in the collection.
 * @param userData- user data object
 * @return created users
 */
export const createUser = async (userData: FilteredUserData): Promise<UserResponseObject> | never => {
    try {
        const userDocument: UserDocument = await new User(userData).save();
        const { password, _id, ...remainingData } = userDocument.toObject();
        return { user: remainingData };
    } catch (error) {
        logger.error("user controller:: createUser", error);
        throw error;
    }
};

/**
 * return the user by provided identifier
 * @param userParams - request params
 * @return selected user
 */
export const getUserById = async ({ userId }: UserParams): Promise<UserResponseObject> | never => {
    try {
        const user: IUser | null = await User.findOne({ username: userId })
            .select(excludeFields)
            .lean()
            .exec();
        if (!user) {
            throw errorMessage("No users found");
        }
        return { user };
    } catch (error) {
        logger.error("user controller:: getUserById", error);
        throw error;
    }
};

/**
 * updates the mongodb document in user collection.
 * @param userParams - request params
 * @param userData- user data
 * @return updated user
 */
export const updateUser = async ({ userId }: UserParams, userData: FilteredUserData | FilteredUserControlData)
    : Promise<UserResponseObject> | never => {
    try {
        const user: IUser | null = await User
            .findOneAndUpdate({ username: userId }, { $set: userData }, { new: true })
            .select(excludeFields)
            .lean()
            .exec();
        if (!user) {
            throw errorMessage("No users found");
        }
        return { user };
    } catch (error) {
        logger.error("user controller:: updateUser", error);
        throw error;
    }
};

/**
 * deletes the document in user collection by id.
 * @param userParams - request params
 * @return object containing delete info
 */
export const deleteUser = async ({ userId }: UserParams)
    : (Promise<QueryStatus<QueryFlags.DELETED>> | never) => {
    try {
        const { deletedCount } = await User.remove({ username: userId }).exec();
        if (!deletedCount) {
            throw errorMessage("No user Found");
        }
        return { message: QueryFlags.DELETED };
    } catch (error) {
        logger.error("user controller:: deleteUser", error);
        throw error;
    }
};

/**
 * returns the userId from request param
 * @param requestParams - request params
 * @returns return extracted param
 */
export const getUserIdFromParams = ({ userId }: ParamsDictionary): UserParams => ({ userId });

/**
 * filter user data
 * @param userData - user data
 * @returns return filtered user data
 */
export const filterUserData = (userData: IUser): FilteredUserData => {
    const { phoneNo, hasEmailVerified, role, activeStatus, ...remainingData } = userData;
    return {
        ...remainingData,
        ...phoneNo ? { phoneNo } : null
    };
};

/**
 * filter user control data
 * @param userData - user data
 * @returns return filtered user data
 */
export const filterUserControlData = (userData: IUser): FilteredUserControlData => {
    const { hasEmailVerified, role, activeStatus } = userData;
    return {
        hasEmailVerified,
        role,
        activeStatus
    };
};

/**
 * returns the extracted query
 * @param query - request query
 * @returns extracted query
 */
export const extractQueryParams = (query: ParsedQs)
    : UserQueries => {
    const { firstName, lastName, username, email } = query;
    return {
        ...firstName ? { firstName: String(firstName) } : null,
        ...username ? { username: String(username) } : null,
        ...lastName ? { lastName: String(lastName) } : null,
        ...email ? { email: String(email) } : null,
    };
};
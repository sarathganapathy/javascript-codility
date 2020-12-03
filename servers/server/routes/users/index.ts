import { Router } from "express";
import isUserSignedIn from "../../middleware/isUserSignedIn";
import permissions from "../../config/accessControlConfig";
import { generateAccess, Operations } from "../../middleware/accessControl";
import { UserParams, UserQueries, FilteredUserData, FilteredUserControlData } from "../../types/user";
import { Routes } from "../../types/util";
import {
    deleteResponseHandler,
    getResponseHandler,
    postResponseHandler,
    updateResponseHandler,
} from "../../../sharedUtils/routeHandler";

import {
    createUser,
    deleteUser,
    extractQueryParams,
    getAllUsers,
    getUserById,
    getUserIdFromParams,
    updateUser,
    filterUserData,
    filterUserControlData
} from "../../controller/user";

const hasAccess = generateAccess(permissions);
const router = Router();

// REST services for user data

// get all request
router.get(
    "/",
    isUserSignedIn,
    getResponseHandler<null, UserQueries>(getAllUsers, (x) => null, extractQueryParams)
);
// get request by id
router.get(
    "/:userId",
    isUserSignedIn,
    getResponseHandler<UserParams>(getUserById, getUserIdFromParams, (x) => null)
);
// create request
router.post(
    "/",
    postResponseHandler<FilteredUserData>(createUser, filterUserData)
);
// update requests
router.put(
    "/:userId",
    isUserSignedIn,
    hasAccess(Routes.User, Operations.Update),
    updateResponseHandler<UserParams, FilteredUserData>(updateUser, getUserIdFromParams, filterUserData)
);
router.patch(
    "/:userId",
    isUserSignedIn,
    hasAccess(Routes.User, Operations.Update),
    updateResponseHandler<UserParams, FilteredUserData>(updateUser, getUserIdFromParams, filterUserData)
);
// delete request
router.delete(
    "/:userId",
    isUserSignedIn,
    hasAccess(Routes.User, Operations.Delete),
    deleteResponseHandler<UserParams>(deleteUser, getUserIdFromParams)
);

// Admin usage only

// update requests
router.put(
    "/userControl/:userId",
    isUserSignedIn,
    hasAccess(`${Routes.User}/userControl`, Operations.Update),
    updateResponseHandler<UserParams, FilteredUserControlData>(updateUser, getUserIdFromParams, filterUserControlData)
);
router.patch(
    "/userControl/:userId",
    isUserSignedIn,
    hasAccess(`${Routes.User}/userControl`, Operations.Update),
    updateResponseHandler<UserParams, FilteredUserControlData>(updateUser, getUserIdFromParams, filterUserControlData)
);
export default router;

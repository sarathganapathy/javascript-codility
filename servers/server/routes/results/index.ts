import { Router } from "express";
import isUserSignedIn from "../../middleware/isUserSignedIn";
import permissions from "../../config/accessControlConfig";
import { generateAccess, Operations } from "../../middleware/accessControl";
import { Routes } from "../../types/util";
import { Result, ResultParams, ResultQueries } from "../../types/result";
import {
    deleteResponseHandler,
    getResponseHandler,
    // postResponseHandler, // should use it only for testing purpose
    updateResponseHandler
} from "../../../sharedUtils/routeHandler";
import {
    // createResult, // should use it only for testing purpose
    deleteResult,
    extractQueryParams,
    getAllResults,
    getResultById,
    getResultIdFromParams,
    updateResult
} from "../../controller/result";

const hasAccess = generateAccess(permissions);
const router = Router();

// REST services for result data

// get request
router.get(
    "/",
    isUserSignedIn,
    getResponseHandler<null, ResultQueries>(getAllResults, (x) => null, extractQueryParams)
);
router.get(
    "/:resultId",
    isUserSignedIn,
    getResponseHandler<ResultParams>(getResultById, getResultIdFromParams, (x) => null)
);

// create request
// should use it only for testing purpose

// router.post(
//     "/",
//     isUserSignedIn,
//     hasAccess(Routes.Result, Operations.Create),
//     postResponseHandler<Result>(createResult)
// );

// update request
router.put(
    "/:resultId",
    isUserSignedIn,
    hasAccess(Routes.Result, Operations.Update),
    updateResponseHandler<ResultParams, Result>(updateResult, getResultIdFromParams)
);
router.patch(
    "/:resultId",
    isUserSignedIn,
    hasAccess(Routes.Result, Operations.Update),
    updateResponseHandler<ResultParams, Result>(updateResult, getResultIdFromParams)
);
// delete request
router.delete(
    "/:resultId",
    isUserSignedIn,
    hasAccess(Routes.Result, Operations.Delete),
    deleteResponseHandler<ResultParams>(deleteResult, getResultIdFromParams)
);
export default router;

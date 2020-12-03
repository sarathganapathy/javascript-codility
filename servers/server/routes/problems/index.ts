import { Router } from "express";
import isUserSignedIn from "../../middleware/isUserSignedIn";
import permissions from "../../config/accessControlConfig";
import { generateAccess, Operations } from "../../middleware/accessControl";
import { Routes } from "../../types/util";
import { Problem, ProblemParams, ProblemQueries } from "../../types/problem";
import {
    deleteResponseHandler,
    getResponseHandler,
    postResponseHandler,
    updateResponseHandler
} from "../../../sharedUtils/routeHandler";
import {
    createProblem,
    deleteProblem,
    extractQueryParams,
    getAllProblems,
    getProblemById,
    getProblemIdFromParams,
    updateProblem
} from "../../controller/problem";

const hasAccess = generateAccess(permissions);
const router = Router();

// REST services for problem data

// get request
router.get(
    "/",
    isUserSignedIn,
    getResponseHandler<null, ProblemQueries>(getAllProblems, (x) => null, extractQueryParams)
);
router.get(
    "/:problemId",
    isUserSignedIn,
    getResponseHandler<ProblemParams>(getProblemById, getProblemIdFromParams, (x) => null)
);
// create request
router.post(
    "/",
    isUserSignedIn,
    hasAccess(Routes.Problem, Operations.Create),
    postResponseHandler<Problem>(createProblem)
);
// update request
router.put(
    "/:problemId",
    isUserSignedIn,
    hasAccess(Routes.Problem, Operations.Update),
    updateResponseHandler<ProblemParams, Problem>(updateProblem, getProblemIdFromParams)
);
router.patch(
    "/:problemId",
    isUserSignedIn,
    hasAccess(Routes.Problem, Operations.Update),
    updateResponseHandler<ProblemParams, Problem>(updateProblem, getProblemIdFromParams)
);
// delete request
router.delete(
    "/:problemId",
    isUserSignedIn,
    hasAccess(Routes.Problem, Operations.Delete),
    deleteResponseHandler<ProblemParams>(deleteProblem, getProblemIdFromParams)
);
export default router;

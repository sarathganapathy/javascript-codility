import { Router } from "express";
import isUserSignedIn from "../../middleware/isUserSignedIn";
import { getResponseHandler } from "../../../sharedUtils/routeHandler";
import { getAllLanguages } from "../../controller/language";

const router = Router();

// REST services for language

// get request
router.get(
    "/",
    isUserSignedIn,
    getResponseHandler(getAllLanguages, (x) => null, (x) => null)
);

export default router;
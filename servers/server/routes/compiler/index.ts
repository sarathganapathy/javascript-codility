import { Router } from "express";
import isUserSignedIn from "../../middleware/isUserSignedIn";
import { getResponseHandler, postResponseHandler } from "../../../sharedUtils/routeHandler";
import { compileCode, submitCode, getCompilerStatus, getLanguageFromParams } from "../../controller/compiler";
import {
    CompilerStatusParams,
    CompilerCompileData,
    CompilerSubmitData,
    TotalTestToExecute
} from "../../types/compiler";

const router = Router();

// compile
router.post(
    "/compile",
    isUserSignedIn,
    (req: any, res: any) =>
        postResponseHandler<CompilerCompileData>(
            compileCode(req.user ? req.user.username : "", TotalTestToExecute.Half)
        )(req, res)
);

// submit
router.post(
    "/submit",
    isUserSignedIn,
    (req: any, res: any) =>
        postResponseHandler<CompilerSubmitData>(
            submitCode(req.user ? req.user.username : "", TotalTestToExecute.Full)
        )(req, res)
);

// compiler status
router.get(
    "/compilerStatus/:language",
    isUserSignedIn,
    getResponseHandler<CompilerStatusParams>
        (getCompilerStatus, getLanguageFromParams, (x) => null)
);

export default router;

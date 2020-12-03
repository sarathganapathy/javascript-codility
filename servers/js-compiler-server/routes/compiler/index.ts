import { Router } from "express";
import { postResponseHandler } from "../../../sharedUtils/routeHandler";
import { compileCode } from "../../controller/compiler";
import { CompilerData } from "../../types/compiler";

// express router
const router = Router();

// route to compile the JSCode
router.post("/", postResponseHandler<CompilerData>(compileCode));

export default router;

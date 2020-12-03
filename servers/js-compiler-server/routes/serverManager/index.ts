import { Router } from "express";
import { getResponseHandler } from "../../../sharedUtils/routeHandler";
const router = Router();

// route to get server status
router.get("/status", getResponseHandler(() => Promise.resolve(), (x) => null, (x) => null));

export default router;

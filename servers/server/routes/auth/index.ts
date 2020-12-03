import { Router } from "express";
import {
    authenticationHandler
} from "../../../sharedUtils/routeHandler";

import {
    isUserAuthenticated,
    login,
    logout
} from "../../controller/auth";

const router = Router();

// REST services for authentication data

router.get("/isAuthenticated", authenticationHandler(isUserAuthenticated));
router.post("/login", authenticationHandler(login));
router.get("/logout", authenticationHandler(logout));

export default router;
import { Request, Response, Router } from "express";
import authRoutes from "./auth";
import compilerRoutes from "./compiler";
import eventRoutes from "./events";
import languageRoutes from "./language";
import problemsRoutes from "./problems";
import resultsRoutes from "./results";
import userRoutes from "./users";
import { Routes } from "../types/util";

const router = Router();

/*
 * Use this area to define any thing which is a pure api using get and post or delete
 * Also the response will be JSON.
 */
router.get("/test", (req: Request, res: Response) => {
    res.json({
        test: true
    });
});

// Routes for application
router.use(`/${Routes.Auth}`, authRoutes);
router.use(`/${Routes.Compiler}`, compilerRoutes);
router.use(`/${Routes.Event}`, eventRoutes);
router.use(`/${Routes.Language}`, languageRoutes);
router.use(`/${Routes.Problem}`, problemsRoutes);
router.use(`/${Routes.Result}`, resultsRoutes);
router.use(`/${Routes.User}`, userRoutes);

export default router;

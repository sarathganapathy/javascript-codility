import { Router } from "express";
import compilerRoutes from "./compiler";
import serverManagerRoutes from "./serverManager";
import userDirRoutes from "./userDirectories";
import basicAuth from "../config/authorization";
import { Routes } from "../types/util";
const router = Router();

/*
 * Use this area to define any thing which is a pure api using get and post or delete
 * Also the response will be JSON.
 */

router.use(`/${Routes.Compile}`, basicAuth, compilerRoutes);
router.use(`/${Routes.ServerManager}`, basicAuth, serverManagerRoutes);
router.use(`/${Routes.UserDir}`, basicAuth, userDirRoutes);

export default router;

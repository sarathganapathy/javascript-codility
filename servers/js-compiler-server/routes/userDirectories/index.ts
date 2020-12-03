import { Router } from "express";
import { deleteResponseHandler, getResponseHandler } from "../../../sharedUtils/routeHandler";
import { deleteAllFolder, deleteFolderById, getFolderList, getIdFromParams } from "../../controller/userDirectories";
import { UserDirExtractedParam } from "../../types/userDirectory";
const router = Router();

// route to get user folder list
router.get("/folderList", getResponseHandler(getFolderList, (x) => null, (x) => null));
// route to clear all user folders
router.delete("/folderList/all", deleteResponseHandler(deleteAllFolder, (x) => null));
// route to clear user folder
router.delete("/folderList/:name", deleteResponseHandler<UserDirExtractedParam>(deleteFolderById, getIdFromParams));

export default router;

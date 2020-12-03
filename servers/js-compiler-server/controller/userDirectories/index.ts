import logger from "../../logger";
import { readDir, removeDirectory, removeChildDirectories } from "../../../sharedUtils/fileHelpers";
import { resolvePaths } from "../../../sharedUtils/utils";
import { ParamsDictionary, UserDirExtractedParam, DirectoryList } from "../../types/userDirectory";
import { FileOperationFlags, FileOperationStatus } from "../../types/util";

/**
 * returns the userFolders created wile compiling
 * @returns return promise containing an array of results
 */
export const getFolderList = async (): Promise<DirectoryList> | never => {
    try {
        const list = await readDir(resolvePaths(process.cwd(), "./public/jsCompiledCode"));
        return ({ list });
    } catch (error) {
        logger.error("UserDirectory controller:: getFolderList");
        throw error;
    }
};

/**
 * returns the userFolders created wile compiling
 * @returns return promise containing status
 */
export const deleteAllFolder = (): Promise<FileOperationStatus<FileOperationFlags.DELETED>> => {
    const { error, hasRemoved } = removeChildDirectories(resolvePaths(process.cwd(), "./public/jsCompiledCode"));
    return !error && hasRemoved
        ? Promise.resolve({ message: FileOperationFlags.DELETED })
        : Promise.reject(error);
};

/**
 * returns the userFolders created while compiling
 * @returns return promise containing status
 */
export const deleteFolderById = ({ name }: UserDirExtractedParam)
    : Promise<FileOperationStatus<FileOperationFlags.DELETED>> => {
    const { error, hasRemoved } = removeDirectory(resolvePaths(process.cwd(), `./public/jsCompiledCode/${name}`));
    return !error && hasRemoved
        ? Promise.resolve({ message: FileOperationFlags.DELETED })
        : Promise.reject(error);
};

/**
 * returns the userFolders created while compiling
 * @returns return promise containing an array of results
 */
export const getIdFromParams = ({ name }: ParamsDictionary): UserDirExtractedParam => ({ name });

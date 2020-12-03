import * as fs from "fs";
import * as path from "path";

// interface / type declarations

/**
 * @interface
 * @def interface for error exception of file system
 */
interface ErrnoException extends Error {
    errno?: number;
    code?: string;
    path?: string;
    syscall?: string;
    stack?: string;
}

/**
 * @interface
 * @def interface for RemoveDirectoryResponse
 */
interface RemoveDirectoryResponse {
    error: Error | null;
    hasRemoved: boolean;
}

// type aliases
type GenericReader<T> = (filePath: string) => Promise<T>;
type GenericWriter<T> = (filePath: string, fileData?: any) => Promise<T>;

// function declarations

/**
 * join all the paths
 * @param  paths - array of paths
 * @returns returns the concatenated  path
 */
const joinPaths = (...paths: string[]): string => path.join(...paths);

/**
 * Function to read the text file
 * @param path - path of file
 * @returns promise containing  string value or error
 */
export const readTextFile: GenericReader<string> = (filePath) => new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err: ErrnoException | null, data: string): void => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});

/**
 * Function to read the JSON file
 * @param path - path of file
 * @returns promise containing  Buffer value or error
 */
export const readJSONFile: GenericReader<Buffer> = (filePath) => new Promise((resolve, reject) => {
    fs.readFile(filePath, (err: ErrnoException | null, data: Buffer): void => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});
/**
 * Function to read directory
 * @param folderPath - path of folder
 * @returns promise containing array of files or error
 */
export const readDir: GenericReader<string[]> = (folderPath) => new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err: ErrnoException | null, files: string[]): void => {
        if (err) {
            reject(err);
        }
        else {
            resolve(files);
        }
    });
});

/**
 * Function to check whether folder/file exits
 * @param  folderPath - path of folder
 * @returns promise containing  boolean value or error
 */
export const exitAsync: GenericReader<boolean> = (folderPath) => new Promise((resolve, reject) => {
    fs.access(folderPath, (err: ErrnoException | null): void => {
        if (err) {
            resolve(false);
        }
        else {
            resolve(true);
        }
    });
});

/**
 * Function to create directory
 * @param folderPath - path of folder
 * @returns promise containing  boolean value or error
 */
export const createDirectory: GenericWriter<boolean> = (folderPath: string) => new Promise((resolve, reject) => {
    fs.mkdir(folderPath, (err: ErrnoException | null): void => {
        if (err) {
            reject(err);
        }
        else {
            resolve(true);
        }
    });
});

/**
 * Function to remove file
 * @param filePath - path of file
 * @returns promise containing  boolean value or error
 */
export const removeFile: GenericWriter<boolean> = (filePath: string) => new Promise((resolve, reject) => {
    fs.unlink(filePath, (error) => {
        if (error) {
            reject(error);
        } else {
            resolve(true);
        }
    });
});

/**
 * @private
 * Function to remove the files inside directory
 * @param files - array of files
 * @param folderPath - path of folder
 * @param shouldRemoveCurrentDir - should remove current directory / or remove only child directories
 * @returns object containing status
 */
const removeFiles = (files: string[], folderPath: string, shouldRemoveCurrentDir: boolean = true): RemoveDirectoryResponse => {
    files.forEach((filename: string) => {
        if (fs.statSync(joinPaths(folderPath, filename)).isDirectory()) {
            removeDirectory(joinPaths(folderPath, filename));
        } else {
            fs.unlinkSync(joinPaths(folderPath, filename));
        }
    });
    if (shouldRemoveCurrentDir) {
        fs.rmdirSync(folderPath);
    }
    return { error: null, hasRemoved: true };
};

/**
 * Function to remove the directory
 * @param folderPath - path of folder
 * @returns object containing status
 */
export const removeDirectory = (folderPath: string): RemoveDirectoryResponse => {
    if (fs.existsSync(folderPath)) {
        try {
            const files: string[] = fs.readdirSync(folderPath);
            if (files.length) {
                return removeFiles(files, folderPath);
            } else {
                fs.rmdirSync(folderPath);
                return { error: null, hasRemoved: true };
            }
        } catch (error) {
            return { error, hasRemoved: false };
        }
    } else {
        return { error: new Error("Path does not exit"), hasRemoved: false };
    }
};

/**
 * Function to remove the child directories
 * @param folderPath - path of folder
 * @returns object containing status
 */
export const removeChildDirectories = (folderPath: string): RemoveDirectoryResponse => {
    if (fs.existsSync(folderPath)) {
        try {
            const files: string[] = fs.readdirSync(folderPath);
            if (files.length) {
                return removeFiles(files, folderPath, false);
            } else {
                return { error: null, hasRemoved: true };
            }
        } catch (error) {
            return { error, hasRemoved: false };
        }
    } else {
        return { error: new Error("Path does not exit"), hasRemoved: false };
    }
};

/**
 * Function to create file
 * @param folderPath - path of folder
 * @param fileData - file data
 * @returns promise containing  boolean value or error
 */
export const createFile: GenericWriter<boolean> = (filePath, fileData) => new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileData, (err: ErrnoException | null): void => {
        if (err) {
            reject(err);
        }
        else {
            resolve(true);
        }
    });
});
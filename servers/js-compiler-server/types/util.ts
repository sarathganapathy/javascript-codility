/**
 * @def enum for file operation flags
 * @enum
 */
export enum FileOperationFlags {
    APPENDED = "Appended",
    CREATED = "Created",
    DELETED = "Deleted",
    FAILED = "Failed",
    READ = "Read",
    UPDATED = "Updated",
}

/**
 * @def interface for file operation status
 * @interface
 */
export interface FileOperationStatus<T extends FileOperationFlags> {
    message: T;
}

/**
 * @interface
 * @def interface for routes
 */
export enum Routes {
    Compile =  "compile",
    ServerManager =  "serverManager",
    UserDir = "userDir",
}
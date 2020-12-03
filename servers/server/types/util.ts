/***
 * @interface
 * @def interface for request params
 */
export interface ParamsDictionary { [key: string]: string; }

/***
 * @interface
 * @def interface for languages
 */
export interface Languages {
    language: string;
    versionSupport: string;
}

/***
 * @interface
 * @def interface for request queries
 */
export interface ParsedQs { [key: string]: string | string[] | ParsedQs | ParsedQs[] | undefined; }

/**
 * @def enum for default values
 * @enum
 */
export enum DefaultValues {
    BycryptRounds = 10,
    NoResults = "--",
}

/**
 * @def enum for query flags
 * @enum
 */
export enum QueryFlags {
    CREATED = "Created",
    DELETED = "Deleted",
    FAILED = "Failed",
    UPDATED = "Updated",
}

/**
 * @def interface for query status
 * @interface
 */
export interface QueryStatus<T extends QueryFlags> {
    message: T;
}

/**
 * @def interface for response object
 * @interface
 */
export interface ResponseObject<T> {
    response: T;
    status: {
        flag: string;
        message: string
    };
}

/**
 * @interface
 * @def interface for routes
 */
export enum Routes {
    Auth =  "auth",
    Compiler =  "compiler",
    Event = "event",
    Language =  "language",
    Problem = "problem",
    Result = "result",
    User = "user",
}
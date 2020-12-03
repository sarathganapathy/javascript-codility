/**
 * @interface
 * @def interface for param dictionary
 */
export interface ParamsDictionary { [key: string]: string; }

/**
 * @interface
 * @def interface for user extracted params
 */
export interface UserDirExtractedParam {
    name: string;
}

/**
 * @interface
 * @def interface for directory list
 */

export interface DirectoryList {
    list: string[];
}
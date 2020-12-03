import * as path from "path";

/**
 * join all the paths
 * @param  paths - array of paths
 * @returns returns the concatenated path
 */
export const joinPaths = (...paths: string[]): string => path.join(...paths);

/**
 * resolve all the paths
 * @param  paths - array of paths
 * @returns returns the concatenated path
 */
export const resolvePaths = (...paths: string[]): string => path.resolve(...paths);

/**
 * Error message
 * @param  message - error message
 * @returns returns the instance of error
 */
export const errorMessage = (message: string): Error => new Error(message);

/**
 * Generator function to return unique iterator object
 * @returns unique iterator object
 */
const unique = function* () {
    let count = 0;
    while (true) {
        yield count++;
    }
};
const uniqueIterator = unique();

/**
 * Function to generate unique number
 * @param prefix - prefix to prepend  unique key
 * @returns unique key
 */
export const generateUniqueKey = (prefix: string): string => `${prefix}${uniqueIterator.next().value}`;
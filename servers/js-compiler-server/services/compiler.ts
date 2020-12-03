import * as clearModule from "clear-module";
import logger from "../logger";
import { exitAsync, createDirectory, createFile } from "../../sharedUtils/fileHelpers";
import { ProblemData, SolutionFunction, CompiledResults } from "../types/compiler";
import { resolvePaths, joinPaths } from "../../sharedUtils/utils";

/**
 * @constant assertion
 * assert object for assertions
 */
const assert = {
    toEqual: (value1: any, value2: any) => JSON.stringify(value1) === JSON.stringify(value2),
    toBe: (value1: any, value2: any) => value1 === value2
};

/**
 * Function to sanitize the code
 * @param code - solution code
 * @returns sanitized code
 * @TODO more sanitization of code should be implemented
 */
const sanitizeCode = (code: string): string => code.replace("eval", "");

/**
 * Function to generate the code file
 * @param code - solution code
 * @param problemName - problem name
 * @param user - username
 * @returns returns the promise of boolean status if file is created
 */
const generateCodeFile = async (code: string, problemName: string, user: string): Promise<boolean> | never => {
    const folderPath = resolvePaths(process.cwd(), "./public/jsCompiledCode/", user);
    const filePath = joinPaths(folderPath, `${problemName.replace(/\s+/g, '')}.js`);
    // To improve the performance while executing multiple problems in events and re-compiling the results
    // If folder is created already, don't re-create it.
    // using fs.write to re-create the content instead of deleting and re-creating the file
    // once user submits and admin publish the results, all user data will be deleted
    try {
        const hasCachedFolder = await exitAsync(folderPath);
        if (!hasCachedFolder) {
            await createDirectory(folderPath);
        }
        return createFile(joinPaths(filePath), code);
    } catch (error) {
        logger.error("Error in generating code file", error);
        throw error;
    }
};

/**
 * Function to validate the results
 * @param solFunc - solution function
 * @param inputs - array of inputs
 * @param outputs - array of outputs
 * @returns Array of validated results
 */
const validateResults = (solFunc: SolutionFunction, inputs: any[], outputs: any[]): any[] =>
    solFunc && inputs.length === outputs.length
        ? inputs.map((input: any, index: number) => assert.toEqual(outputs[index], solFunc(...input)))
        : [];

/**
 * Function to compute the results
 * @param user - user name
 * @param problemData - problem data
 * @returns return the validated results in the form of array
 */
const computeResults = async (user: string, problemData: ProblemData): Promise<CompiledResults> | never => {
    const { code, inputs, problemId, problemTitle, outputs } = problemData;
    const sanitizedCode = sanitizeCode(code);
    try {
        const problemName = `${problemId}_${problemTitle}`;
        await generateCodeFile(sanitizedCode, problemName, user);
        // clear the cache every time
        clearModule(`../../../public/jsCompiledCode/${user}/${problemName.replace(/\s+/g, '')}`);
        const { solve: solFunc } = require(
            `../../../public/jsCompiledCode/${user}/${problemName.replace(/\s+/g, '')}`
        );
        return { results: validateResults(solFunc, inputs, outputs) };
    } catch (error) {
        logger.error("error in compiling JS code", error);
        throw error;
    }
};

export default computeResults;

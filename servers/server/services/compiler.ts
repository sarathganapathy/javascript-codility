import config from "../../sharedUtils/config";
import { Result, ResultData } from "../types/result";
import { CompilerCompileData, CompilerSubmitData, Authorization } from "../types/compiler";
import { generateUniqueKey } from "../../sharedUtils/utils";

/**
 * get the server url from language
 * @param language language
 * @returns returns the compiler server url based on language
 */
export const getServerUrl = (language: string): string => {
    const serverInfo = config[`${language}Server`];
    return serverInfo && serverInfo.url || "";
};

/**
 * get the server url from language
 * @param language language
 * @returns returns the compiler server url based on language
 */
export const getServerAuthorization = (language: string): Authorization => {
    const serverInfo = config[`${language}Server`];
    return serverInfo && serverInfo.auth as Authorization || {};
};

/**
 * Function to calculate the result percentage
 * @param results - results
 * @number percentage of result
 */
export const calculateResultPercentage = (results: boolean[]): number =>
    Math.round(results.length ? ((results.reduce((acc: number, result: boolean) =>
        result ? ++acc : acc, 0) * 100) / results.length) : 0);

/*
 * get the server url from language
 * @param language language
 * @returns returns the compiler server url based on language
 */
export const generateResultsToSave = (resultData: ResultData[], submitData: CompilerSubmitData, user: string): Result =>
    ({
        eventId: submitData.eventId,
        resultId: generateUniqueKey(Date.now().toString()),
        resultsData: resultData,
        solution: submitData.problems.map(({ problemId, language, code }: CompilerCompileData) => (
            {
                problemId,
                language,
                code
            }
        )),
        solvedBy: user
    });

import logger from "../../logger";
import { errorMessage } from "../../../sharedUtils/utils";
import { getProblemById } from "../../controller/problem";
import { createResult } from "../../controller/result";
import { getServerStatus, postCodeForCompile } from "../../data";
import { ParamsDictionary } from "../../types/util";
import {
    getServerUrl,
    generateResultsToSave,
    calculateResultPercentage,
    getServerAuthorization
} from "../../services/compiler";
import {
    ProblemData,
    CompilerResponseObject,
    SubmitResponseObject,
    CompilerStatusParams,
    CompilerCompileData,
    CompilerSubmitData
} from "../../types/compiler";

type CompilerHandler = (data: CompilerCompileData) => Promise<CompilerResponseObject> | never;
type SubmitHandler = (data: CompilerSubmitData) => Promise<SubmitResponseObject> | never;

/**
 * Controller to compile the code
 * @param user - username
 * @param numOfTestToInclude - total number of test to include
 * @returns return promise
 */
export const compileCode = (user: string, numOfTestToInclude: number): CompilerHandler => async (compileData) => {
    if (!user) {
        throw errorMessage("Invalid user");
    }
    const { code, language, problemId }: CompilerCompileData = compileData;
    try {
        const { problem: { inputs, outputs, problemTitle } } = await getProblemById({ problemId });
        const problemData: ProblemData = {
            inputs: inputs.slice(0, numOfTestToInclude),
            outputs: outputs.slice(0, numOfTestToInclude),
            user,
            code,
            problemId,
            problemTitle
        };
        const { response } = await postCodeForCompile(
            getServerUrl(language),
            { user, problemData },
            getServerAuthorization(language)
        );
        return response;
    } catch (error) {
        logger.error("compiler controller :: compileCode", error);
        throw errorMessage("Failed to compile");
    }
};

/**
 * Controller to submit the code
 * @param user - username
 * @param numOfTestToInclude - total number of test to include
 * @returns return promise
 */
export const submitCode = (user: string, numOfTestToInclude: number): SubmitHandler => async (submitData) => {
    try {
        const compileCodeFunc = compileCode(user, numOfTestToInclude);
        const { problems } = submitData;
        const compiledResults = await Promise.all(problems.map(problem => compileCodeFunc(problem)));
        const resultsData = compiledResults.map(({ results }, index) => ({
            problemId: problems[index].problemId,
            result: results,
            percentage: calculateResultPercentage(results)
        }));
        await createResult(generateResultsToSave(resultsData, submitData, user));
        return { results: resultsData };
    } catch (error) {
        logger.error("compiler controller :: submitCode", error);
        throw errorMessage("Failed to submit the code");
    }
};

/**
 * Controller to get compiler status
 * @param language - language
 * @returns return status of compiler server
 */
export const getCompilerStatus = ({ language }: CompilerStatusParams): Promise<boolean> =>
    getServerStatus(getServerUrl(language));

/**
 * returns the language from request param
 * @returns return language
 */
export const getLanguageFromParams = ({ language }: ParamsDictionary): CompilerStatusParams => ({ language });
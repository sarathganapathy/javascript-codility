import logger from "../../logger";
import Problem from "../../models/problem";
import { errorMessage } from "../../../sharedUtils/utils";
import {
    Problem as IProblem,
    ProblemResponseObjects,
    ProblemResponseObject,
    ProblemParams,
    ProblemQueries,
    ProblemDocument,
} from "../../types/problem";
import { ParamsDictionary, ParsedQs, QueryStatus, QueryFlags } from "../../types/util";

// exclude id  ("fileName" - include, "-fieldName" - exclude)
const excludeFields = "-_id";

/**
 * return the problems as promise object.
 * @param params - extracted request params
 * @param query - extracted request query
 * @return  problems
 */
export const getAllProblems = async (params: null, query: ProblemQueries)
    : Promise<ProblemResponseObjects> | never => {
    try {
        const problems: IProblem[] = await Problem
            .find(query)
            .populate("addedByUserDetails", "-_id username firstName lastName")
            .select(excludeFields)
            .lean()
            .exec();
        return ({
            count: problems.length,
            problems
        });
    } catch (error) {
        logger.error("problem controller:: getAllProblems", error);
        throw error;
    }
};

/**
 * creates the problem as document in the collection.
 * @param problemData - problem data object
 * @return created problem
 */
export const createProblem = async (userData: IProblem): Promise<ProblemResponseObject> | never => {
    try {
        const problemDocument: ProblemDocument = await new Problem(userData).save();
        const { _id, ...remainingData } = problemDocument.toObject();
        return { problem: remainingData };
    } catch (error) {
        logger.error("problem controller:: createProblem", error);
        throw error;
    }
};


/**
 * return the problem by provided identifier
 * @param ProblemParams- problem request parameters
 * @return selected problem
 */
export const getProblemById = async ({ problemId }: ProblemParams)
    : Promise<ProblemResponseObject> | never => {
    try {
        const problem: IProblem | null = await Problem.findOne({ problemId })
            .populate("addedByUserDetails", "-_id username firstName lastName")
            .select(excludeFields)
            .lean()
            .exec();
        if (!problem) {
            throw errorMessage("No problem found");
        }
        return { problem };
    } catch (error) {
        logger.error("problem controller:: getProblemById", error);
        throw error;
    }
};

/**
 * updates the mongodb document in problem collection.
 * @param ProblemParams- problem request parameters
 * @param problemData- problem data
 * @return updated problem
 */
export const updateProblem = async ({ problemId }: ProblemParams, problemData: IProblem)
    : Promise<ProblemResponseObject> | never => {
    try {
        const problem: IProblem | null = await Problem
            .findOneAndUpdate({ problemId }, { $set: problemData }, { new: true })
            .populate("addedByUserDetails", "_id username firstName lastName")
            .select(excludeFields)
            .lean()
            .exec();
        if (!problem) {
            throw errorMessage("No problem found");
        }
        return { problem };
    } catch (error) {
        logger.error("problem controller:: updateProblem", error);
        throw error;
    }
};

/**
 * deletes the document in problem collection by id.
 * @param ProblemParams- problem request parameters
 * @return object containing delete info
 */
export const deleteProblem = async ({ problemId }: ProblemParams)
    : Promise<QueryStatus<QueryFlags.DELETED>> | never => {
    try {
        const { deletedCount } = await Problem.remove({ problemId }).exec();
        if (!deletedCount) {
            throw errorMessage("No user Found");
        }
        return { message: QueryFlags.DELETED };
    } catch (error) {
        logger.error("problem controller:: deleteProblem", error);
        throw error;
    }
};

/**
 * returns the problemId from request param
 * @param requestParams - request params
 * @returns return extracted param
 */
export const getProblemIdFromParams = ({ problemId }: ParamsDictionary): ProblemParams => ({ problemId });

/**
 * returns the extracted query
 * @param query - request query
 * @returns extracted query
 */
export const extractQueryParams = ({ problemId, problemTitle }: ParsedQs)
    : ProblemQueries => ({
        ...problemId ? { problemId: String(problemId) } : null,
        ...problemTitle ? { problemTitle: { $regex: problemTitle, $options: 'i' } } : null,
    });
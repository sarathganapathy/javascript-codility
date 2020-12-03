import logger from "../../logger";
import Result from "../../models/result";
import { errorMessage } from "../../../sharedUtils/utils";
import { ParamsDictionary, ParsedQs, QueryStatus, QueryFlags } from "../../types/util";
import {
    Result as IResult,
    ResultsResponseObjects,
    ResultResponseObject,
    ResultParams,
    ResultQueries,
    ResultDocument,
} from "../../types/result";

// exclude id  ("fileName" - include, "-fieldName" - exclude)
const excludeFields = "-_id";

/**
 * return the results as promise object.
 * @params params - extracted request params
 * @params query - extracted request query
 * @return  results
 */
export const getAllResults = async (params: null, query: ResultQueries)
    : Promise<ResultsResponseObjects> | never => {
    try {
        const results: IResult[] = await Result
            .find(query)
            .populate("problemSolverDetails", "-_id username firstName lastName")
            .populate("EventDetails", "-_id")
            .populate("resultDetails", "-_id")
            .select(excludeFields)
            .lean()
            .exec();
        return ({
            count: results.length,
            results
        });
    } catch (error) {
        logger.error("result controller:: getAllResult", error);
        throw error;
    }
};

/**
 * creates the result as document in the collection.
 * @param resultData- result data object
 * @return created result
 */
export const createResult = async (resultData: IResult): Promise<ResultResponseObject> | never => {
    new Result(resultData).save().catch((error) => {
        logger.error("result controller:: createResult", error);
        throw error;
    });
    try {
        const resultDocument: ResultDocument = await new Result(resultData).save();
        const { _id, ...remainingData } = resultDocument.toObject();
        return { result: remainingData };
    } catch (error) {
        logger.error("result controller:: createResult", error);
        throw error;
    }
};

/**
 * return the result by provided identifier
 * @param ResultParams- result request parameters
 * @return selected result
 */
export const getResultById = async ({ resultId }: ResultParams)
    : Promise<ResultResponseObject> | never => {
    try {
        const result: IResult | null = await Result.findOne({ resultId })
            .populate("problemSolverDetails", "-_id username firstName lastName")
            .populate("EventDetails", "-_id")
            .populate("resultDetails", "-_id")
            .select(excludeFields)
            .lean()
            .exec();
        if (!result) {
            throw errorMessage("No result found");
        }
        return { result };
    } catch (error) {
        logger.error("result controller:: getResultById", error);
        throw error;
    }
};

/**
 * updates the mongodb document in result collection.
 * @param resultParams- result request parameters
 * @param resultData- result data
 * @return updated result
 */
export const updateResult = async ({ resultId }: ResultParams, resultData: IResult)
    : Promise<ResultResponseObject> | never => {
    try {
        const result: IResult | null = await Result
            .findOneAndUpdate({ resultId }, { $set: resultData }, { new: true })
            .populate("problemSolverDetails", "-_id username firstName lastName")
            .populate("EventDetails", "-_id")
            .populate("resultDetails", "-_id")
            .select(excludeFields)
            .lean()
            .exec();
        if (!result) {
            throw errorMessage("No result found");
        }
        return { result };
    } catch (error) {
        logger.error("result controller:: updateResult", error);
        throw error;
    }
};

/**
 * deletes the document in result collection by id.
 * @param ResultParams- result request parameters
 * @return object containing delete info
 */
export const deleteResult = async ({ resultId }: ResultParams)
    : Promise<QueryStatus<QueryFlags.DELETED>> | never => {
    try {
        const { deletedCount } = await Result.remove({ resultId }).exec();
        if (!deletedCount) {
            throw errorMessage("No results Found");
        }
        return { message: QueryFlags.DELETED };
    } catch (error) {
        logger.error("result controller:: deleteResult", error);
        throw error;
    }
};

/**
 * returns the resultId from request param
 * @param requestParams - request params
 * @returns return extracted param
 */
export const getResultIdFromParams = ({ resultId }: ParamsDictionary): ResultParams => ({ resultId });

/**
 * returns the extracted query
 * @param query - request query
 * @returns extracted query
 */
export const extractQueryParams = ({ resultId, username, eventId }: ParsedQs)
    : ResultQueries => ({
        ...eventId ? { eventId: String(eventId) } : null,
        ...resultId ? { resultId: String(resultId) } : null,
        ...username ? { username: String(username) } : null,
    });
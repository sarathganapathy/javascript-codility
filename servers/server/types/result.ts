import { Document } from "mongoose";

/**
 * @def interface for solution
 * @interface
 */
interface Solution {
    code: string;
    language: string;
    problemId: string;
}

/**
 * @def interface for result data
 * @interface
 */
export interface ResultData {
    percentage: number;
    problemId: string;
    result: boolean[];
}

/**
 * @def interface for result
 * @interface
 */
export interface Result {
    eventId: string;
    resultsData: ResultData[];
    resultId: string;
    solution: Solution[];
    solvedBy: string;
}

/**
 * @def interface for result document
 * @interface
 */
export interface ResultDocument extends Result, Document {
    // add methods
}

/**
 * @def interface for results response object
 * @interface
 */
export interface ResultsResponseObjects {
    count: number;
    results: Result[];
}

/**
 * @def interface for result response object
 * @interface
 */
export interface ResultResponseObject {
   result: Result;
}

/**
 * @interface
 * @def interface for result request params
 */
export interface ResultParams {
    resultId: string;
}

/**
 * @interface
 * @def interface for result queries
 */
export interface ResultQueries {
    eventId?: string;
    resultId?: string;
    username?: string;
}
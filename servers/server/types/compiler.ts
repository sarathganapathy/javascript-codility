import { ResultData } from "./result";

/**
 * @enum
 * @def enum to execute total number
 */
export enum TotalTestToExecute {
    Full = 8,
    Half = 4,
}
/**
 * @interface
 * @def interface for compiler data
 */
export interface ProblemData {
    code: string;
    inputs: any[];
    outputs: any[];
    problemId: string;
    problemTitle: string;
    user: string;
}

/**
 * @interface
 * @def interface for compiler data
 */
export interface CompilerData {
    problemData: ProblemData;
    user: string;
}

/**
 * @interface
 * @def interface for response object
 */
export interface CompilerResponseObject {
    results: boolean[];
}

/**
 * @interface
 * @def interface for response object
 */
export interface SubmitResponseObject {
    results: ResultData[];
}

/**
 * @interface
 * @def interface for compiler request param
 */
export interface CompilerStatusParams {
    language: string;
}

/**
 * @interface
 * @def interface for compiler compile data
 */
export interface CompilerCompileData {
    code: string;
    language: string;
    problemId: string;
}

/**
 * @interface
 * @def interface for compiler submit data
 */
export interface CompilerSubmitData {
    eventId: string;
    problems: CompilerCompileData[];
}

/**
 * @interface
 * @def interface for auth
 */
export interface Authorization {
    password: string;
    username: string;
}
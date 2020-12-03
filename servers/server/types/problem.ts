import { Document } from "mongoose";
/**
 * @def enum for complexity
 * @enum
 */
enum Complexity {
    Easy,
    Medium,
    Tough,
}

/**
 * @def interface for problemSkeleton
 * @interface
 */
interface ProblemSkeleton {
    language: string;
    placeholder: string;
}

/**
 * @def interface for problem
 * @interface
 */
export interface Problem {
    addedBy: string;
    category: string;
    complexity: Complexity;
    description: string;
    inputs: any[];
    outputs: any[];
    problemId: string;
    problemSkeleton: ProblemSkeleton[];
    problemTitle: string;
    totalTime: string;
}

/**
 * @def interface for problem document
 * @interface
 */
export interface ProblemDocument extends Problem, Document {
    // add methods
}

/**
 * @def interface for Problem response object
 * @interface
 */
export interface ProblemResponseObject {
    problem: Problem;
}

/**
 * @def interface for problems response object
 * @interface
 */
export interface ProblemResponseObjects {
    count: number;
    problems: Problem[];
}

/**
 * @interface
 * @def interface for problem request params
 */
export interface ProblemParams {
    problemId: string;
}

/**
 * @interface
 * @def interface for problem queries
 */
export interface ProblemQueries {
    problemId?: string;
    problemTitle?: object;
}
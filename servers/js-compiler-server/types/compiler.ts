/**
 * @interface
 * @def interface for problem data
 */
export interface ProblemData {
    code: string;
    inputs: any[];
    problemId: string;
    problemTitle: string;
    outputs: any[];
}

/**
 * @interface
 * @def interface for compiler data
 */
export interface CompilerData {
    user: string;
    problemData: ProblemData;
}

export interface CompiledResults {
    results: boolean[];
}

/**
 * @type
 * @def type aliases for solution function which is generated from client data
 */
export type SolutionFunction = (...inputs: any[]) => any;
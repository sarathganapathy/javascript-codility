import computeResults from "../../services/compiler";
import { CompilerData, CompiledResults } from "../../types/compiler";

/**
 * Controller to compile the code
 * @param CompilerData - compiler data
 * @returns return promise containing an array of results
 */
export const compileCode = ({ user, problemData }: CompilerData): Promise<CompiledResults> =>
    computeResults(user, problemData);

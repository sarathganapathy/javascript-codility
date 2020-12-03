/* globals sessionStorage */
import axios from 'axios';
import { CompilerData, CompilerResponseObject, Authorization } from "../types/compiler";
import { ResponseObject } from "../types/util";

/**
 * @desc function to get the server status
 * @params language server language;
 * @returns returns promise containing server status
 */
export const getServerStatus = (serverUrl: string): Promise<boolean> =>
    axios.get(`${serverUrl}/serverStatus`);

/**
 * @desc function to compile the code
 * @param problemData - problem details
 * @returns returns promise containing compiled results
 */
export const postCodeForCompile = (serverUrl: string, problemData: CompilerData, auth: Authorization)
    : Promise<ResponseObject<CompilerResponseObject>> => {
    return axios.post(
        `${serverUrl}/api/compile`,
        problemData,
        {
            auth
        }
    ).then(results => results.data);
};
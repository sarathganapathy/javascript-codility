import { readJSONFile } from "../../../sharedUtils/fileHelpers";
import { resolvePaths } from "../../../sharedUtils/utils";
import logger from "../../logger";
import { LanguagesResponse } from "../../types/language";

/**
 * return the languages as promise object.
 * @return  languages
 */
export const getAllLanguages = (): Promise<LanguagesResponse> =>
    readJSONFile(resolvePaths(process.cwd(), "./servers/server/compilerLanguages.json")).then((rawData: any) => {
        const { compilerLanguages } = JSON.parse(rawData);
        return {
            count: compilerLanguages.length,
            languages: compilerLanguages
        };
    }).catch((error) => {
        logger.error("languages controller:: getAllLanguages", error);
        throw error;
    });
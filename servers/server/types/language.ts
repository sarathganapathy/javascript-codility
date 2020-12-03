/***
 * @interface
 * @def interface for languages
 */
export interface Languages {
    language: string;
    versionSupport: string;
}

/***
 * @interface
 * @def interface for languages
 */
export interface LanguagesResponse {
    count: number;
    languages: Languages[];
}
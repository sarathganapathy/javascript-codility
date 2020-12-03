import { Request, Response } from "express";
interface ParamsDictionary { [key: string]: string; }
interface ParsedQs { [key: string]: string | string[] | ParsedQs | ParsedQs[] | undefined; }
interface PostRequest<T> extends Request {
    body: T;
}
type QuerySelector<T> = (query: ParsedQs) => T;
type ParamSelector<T> = (params: ParamsDictionary) => T;
type BodySelector<T> = (body: any) => T;
type GetRequestHandler<T, Q> = (queryData: T, paramsData: Q) => Promise<any>;
type PostRequestHandler<T> = (data: T) => Promise<any>;
type UpdateRequestHandler<T, Q> = (paramsData: T, bodyData: Q) => Promise<any>;
type DeleteRequestHandler<T> = (paramsData: T) => Promise<any>;
type CommonRequestResponseHandler = (
    req: Request,
    res: Response
) => Promise<object>;
type PostRequestResponseHandler<T> = (
    req: PostRequest<T>,
    res: Response
) => Promise<object>;
type GetRequestResponseHandler = CommonRequestResponseHandler;
type DeleteRequestResponseHandler = CommonRequestResponseHandler;
type UpdateRequestResponseHandler = CommonRequestResponseHandler;
type SuccessHandler = (data: object) => Response;
type ErrorHandler = (err: Error) => Response;

/**
 * Create a common helpers which responds with data and a success status block
 * @param  res - Express response object
 * @returns response handler
 */
const respondWithSuccess = (res: Response): SuccessHandler => (data) =>
    res.json({
        ...data ? { response: data } : null,
        status: {
            flag: "S",
            message: "Success"
        }
    });

/**
 * Create a common helpers which responds with error status block
 * @param  res - Express response object
 * @returns response handler
 */
const respondWithFailure = (res: Response): ErrorHandler => (err) =>
    res.status(500).json({
        status: {
            flag: "F",
            message: err ? err.message : "Failed"
        }
    });

/**
 * Create a common helpers which responds with error status for unauthorized users
 * @param  res - Express response object
 * @returns response handler
 */
const respondWithUnauthorizedUser = (res: Response): ErrorHandler => (err) =>
    res.status(401).json({
        status: {
            flag: "F",
            message: err.message
        }
    });
/**
 * Generates a response handler for all get query api for routes
 * @param handler - handler function
 * @param queryExtractor - query extractor
 * @returns Response handler function
 */
export const getResponseHandler: <T = null, U = null> (
    handler: GetRequestHandler<T, U>,
    paramsExtractor: ParamSelector<T>,
    queryExtractor: QuerySelector<U>,
) => GetRequestResponseHandler = (handler, paramsExtractor, queryExtractor) =>
        (req, res) =>
            handler(paramsExtractor(req.params), queryExtractor(req.query))
                .then(respondWithSuccess(res))
                .catch(respondWithFailure(res));

/**
 * Generates a response handler for all get query api for routes
 * @param handler - handler function
 * @param queryExtractor - query extractor
 * @returns Response handler function
 */
export const postResponseHandler: <T = null, Q = null>(
    handler: PostRequestHandler<T>,
    bodyExtractor?: BodySelector<T>,
) => PostRequestResponseHandler<T> = (handler, bodyExtractor = (x) => x) => (
    req,
    res
) =>
    handler(bodyExtractor(req.body))
        .then(respondWithSuccess(res))
        .catch(respondWithFailure(res));


/**
 * Generates a response handler for all delete query api for routes
 * @param handler - handler function
 * @param paramsExtractor - param  extractor
 * @returns Response handler function
 */
export const deleteResponseHandler: <T = null> (
    handler: DeleteRequestHandler<T>,
    paramsExtractor: ParamSelector<T>
) => DeleteRequestResponseHandler = (handler, paramsExtractor) => (
    req,
    res
) =>
    handler(paramsExtractor(req.params))
        .then(respondWithSuccess(res))
        .catch(respondWithFailure(res));

/**
 * Generates a response handler for all update query api for routes
 * @param handler - handler function
 * @param paramsExtractor - param extractor
 * @returns Response handler function
 */
export const updateResponseHandler: <T = null, Q = null>(
    handler: UpdateRequestHandler<T, Q>,
    paramsExtractor: ParamSelector<T>,
    bodyExtractor?: BodySelector<Q>,
) => UpdateRequestResponseHandler = (handler, paramsExtractor, bodyExtractor = (x) => x) => (
    req,
    res
) =>
    handler(paramsExtractor(req.params), bodyExtractor(req.body))
        .then(respondWithSuccess(res))
        .catch(respondWithFailure(res));

/**
 * handler for authentication routes
 * @param handler - handler function
 * @returns Response handler function
 */
export const authenticationHandler = (
    handler: (request: Request, response: Response) => Promise<any>
) => (request: Request, response: Response) =>
        handler(request, response)
            .then(respondWithSuccess(response))
            .catch(respondWithUnauthorizedUser(response));
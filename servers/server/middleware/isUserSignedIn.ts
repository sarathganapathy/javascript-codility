import { Request, Response, NextFunction } from "express";
import * as passport from "passport";
import { UserDocument } from "../types/user";

/**
 * returns error message for response object
 * @param message error message
 * @returns error data
 */
const getErrorData = (message: string) => ({
    status: {
        flag: "F",
        message
    }
});

/**
 * Function to check whether user is signed in user
 * @param request request
 * @param response response
 * @param next next function
 * @returns function to authenticate
 */
const isUserSignedIn = (
    request: Request,
    response: Response,
    next: NextFunction
): any => passport.authenticate(
        'jwt',
        { session: false },
        (err: any, user: UserDocument) => {
            if (!(!err && user && request.user)) {
                return response.status(401).json(getErrorData("Unauthorized user: Please sign in")); // send the error response to client
            }
            return next(); // continue to next middleware if no error.
        }
    )(request, response, next);

export default isUserSignedIn;

import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import logger from "../../logger";
import config from "../../config";
import { Request, Response } from "express";
import { PassportUserData, IsAuthenticatedObject, LoginResponseObject } from "../../types/auth";

/**
 * This function takes a request and checks if the user is already authenticated.
 * @param request - the request object
 * @param response - the response object
 * @returns an object with valid data for the ISessionAuthInfo type
 */
export const isUserAuthenticated = (request: Request, response: Response)
  : Promise<IsAuthenticatedObject> => new Promise((resolve) => {
    passport.authenticate(
      'jwt',
      { session: false },
      (err: Error, user: PassportUserData) => {
        resolve({
          isAuthenticated: Boolean(!err && user && request.user),
          username: user && request.user ? user.username : ""
        });
      }
    )(request, response);
  });

/**
 * return the jwt token as json in response of the http.
 * @param request - the request object
 * @param response - the response object
 * @return function to handle login
 */
export const login = (request: Request, response: Response)
  : Promise<LoginResponseObject> => new Promise((resolve, reject) => {
    passport.authenticate(
      'local',
      { session: false },
      (error: Error, user: PassportUserData) => {
        if (error || !user) {
          logger.error("auth controller:: login", error);
          reject(error);
          return;
        }

        /** This is what ends up in our JWT */
        const payload = {
          username: user.username,
          role: user.role,
          expires: Date.now() + parseInt(config.passport.jwtExpireTime, 10),
        };
        request.logIn(payload, (err: Error) => {
          if (err) {
            logger.error("auth controller:: login", err);
            reject(err);
            return;
          }
          /** generate a signed json web token and return it in the response */
          const token = jwt.sign(JSON.stringify(payload), config.passport.secret);
          /** assign our jwt to the cookie */
          response.cookie('jwt', token, { httpOnly: true });
          resolve({
            message: "Successfully logged in",
            userDetails: { username: user.username }
          });
        });
      },
    )(request, response);
  });

/**
 * Function for logout
 * @description clears the user session during logout
 * @param request - the request object
 * @param response - the response object
 * @return function to handle Logout
 */
export const logout = async (request: Request): Promise<object> => {
  request.logOut();
  return { message: "Successfully logged out" };
};

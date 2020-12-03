import * as bcrypt from "bcrypt";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { PassportStatic } from "passport";
import User from "../models/user";
import config from "./index";
import { errorMessage } from "../../sharedUtils/utils";
import { UserDocument } from "../types/user";

/**
 * function to extract jwt from cookies
 * @param req - request object
 * @returns jwtString
 */
const extractJwtFromCookies = (req: any) => req.cookies && req.cookies.jwt || "";

/**
 * Function to configure passport
 * @param passport - authenticator object
 * @returns this function does not return any value
 */
const passportConfig = (passport: PassportStatic): void => {
    // Local strategy
    passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
    }, async (username, password, done) => {
        try {
            const user: UserDocument | null = await User.findOne({ username }).exec();
            const passwordsMatch = user && await bcrypt.compare(password, user.password);
            const isUserActivated = user && user.activeStatus || user && user.role === "Admin";
            if (passwordsMatch) {
                if (isUserActivated) {
                    return done(null, user);
                }
                return done(errorMessage('User is not activated'));
            } else {
                return done(errorMessage('Incorrect Username / Password'));
            }
        } catch (error) {
            done(error);
        }
    }));

    // serialize
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    // deserialize
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    // JWT strategy
    const options = {
        jwtFromRequest: extractJwtFromCookies,
        secretOrKey: config.passport.secret
    };
    passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
        if (jwtPayload.expires > Date.now()) {
            return done(errorMessage('jwt token has been expired. Please login again'));
        }
        try {
            const user: UserDocument | null = await User.findOne({ username: jwtPayload.username }).exec();
            if (user) {
                return done(null, jwtPayload);
            } else {
                return done(errorMessage('Invalid token, user did not match'));
            }
        } catch (error) {
            done(error);
        }
    }));
};

export default passportConfig;
import * as basicAuth from "express-basic-auth";
import config from "./index";

/**
 * Function to return response for unauthorized user
 * @returns response
 */
const getUnauthorizedResponse = () => ({
    status: {
        flag: "F",
        message: "Unauthorized user"
    }
});

/**
 * Function for basic authorization
 */
export default basicAuth({
    ...config.authorization,
    unauthorizedResponse: getUnauthorizedResponse
});
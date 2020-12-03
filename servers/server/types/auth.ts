/**
 * @interface
 * @def interface for login data
 */
export interface PassportUserData {
    expires: string;
    role: string;
    username: string;
}

/**
 * @interface
 * @def interface for isAuthenticated object
 */
export interface IsAuthenticatedObject {
    isAuthenticated: boolean;
    username: string;
}


/**
 * @interface
 * @def interface for response object
 */
export interface LoginResponseObject {
    message: string;
    userDetails: {
        username: string
    };
}

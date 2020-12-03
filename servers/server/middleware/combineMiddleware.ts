import * as connect from "connect";

/**
 * @def function to combine multiple middleware
 * @param middlewareCollection -  array of middleware
 * @returns returns combined middleware as one middleware
 */
const combineMiddleware = ((middlewareCollection: any[]) => {
    const chain = connect();
    middlewareCollection.forEach((middleware: any) => {
        chain.use(middleware);
    });
    return chain;
});

export default combineMiddleware;
import * as bodyParser from "body-parser";
import * as express from "express";
import * as morgan from "morgan";

import sharedConfig from "../sharedUtils/config";
import routes from "./routes";

interface ErrorObject extends Error {
    status?: number;
}

const app = express();

// HTTP request logger middleware for node.js
// Concise output colored by response status for development use.
// The :status token will be colored red for server error codes,
// yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set("port", sharedConfig.javaScriptServer.port);

// When in the "development" env (local dev), these settings must be set in order to pass CORS checks
// Since our credentials mode is set to include - see link below for more details
// https://www.moesif.com/blog/technical/cors/Authoritative-Guide-to-CORS-Cross-Origin-Resource-Sharing-for-REST-APIs/#
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
    });
}

app.use("/api", routes);

// catch 404 and forward to error handler
app.use((
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const err: ErrorObject = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(
    (
        err: ErrorObject,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // render the error page
        res.status(err.status || 500);
        console.error(err);
        res.json({
            status: {
                flag: "F",
                message: "Route not found"
            }
        });
    }
);

app.listen(app.get("port"), () => {
    console.log(
        "Express server listening on port %d in %s mode",
        app.get("port"),
        app.get("env")
    );
});

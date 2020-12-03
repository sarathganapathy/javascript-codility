import * as express from "express";
import * as session from "express-session";
import * as morgan from "morgan";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";

import logger from "./logger";
import routes from "./routes";
import config from "./config";
import sharedConfig from "../sharedUtils/config";
import passportConfig from "./config/passportConfig";

interface ErrorObject extends Error {
    status?: number;
}

const { session: sessionConfig, db } = config;
const isDev = process.env.NODE_ENV !== 'production';

const app = express();

// middleware for handling session
app.use(session({
    secret: sessionConfig.secret,
    resave: false,
    saveUninitialized: true
}));
app.use(cookieParser(sessionConfig.secret));
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// serving build
app.use(express.static(path.join(process.cwd(), "build"), { index: false }));
// Need this in order to serve images
app.use(
    "/static",
    express.static(path.join(process.cwd(), "config", "images"), {
        index: false
    })
);
// HTTP request logger middleware for node.js
// Concise output colored by response status for development use.
// The status token will be colored red for server error codes,
// yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set("port", sharedConfig.appServer.port);

// Set up Mongoose
mongoose.connect(isDev ? db.dev : db.prod, { useNewUrlParser: true })
    .then(() => {
        logger.info("Connected to database");
    })
    .catch((error: any) => {
        logger.error("error connecting to database", error);
    });

// Remove deprecations warning
// https://mongoosejs.com/docs/deprecations.html
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

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

// This is used by 'prod' to load the index.html instead of a server route
app.get("*", (req, res) =>
    res.sendFile(path.join(process.cwd(), "build", "./index.html"))
);

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

import * as log4js from "log4js";

// log4 js to log the errors to file in a server for easy maintance
log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'servers/js-compiler-server/logger/logs/js-server.log' }
    },
    categories: {
        default: { appenders: ['everything'], level: 'debug' }
    }
});

export default log4js.getLogger('cpc');
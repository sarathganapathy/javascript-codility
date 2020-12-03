import * as log4js from "log4js";

// log4 js to log the errors to file in a server for easy maintenance
log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'servers/server/logger/logs/cpc.log' }
    },
    categories: {
        default: { appenders: ['everything'], level: 'debug' }
    }
});

export default log4js.getLogger('cpc');
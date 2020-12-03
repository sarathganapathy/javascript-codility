
/**
 * @interface
 * @def interface for server info
 */
interface ServerInfo {
    hostname: string;
    port: number;
    url: string;
    auth?: object;
}

// server url, port, hostname constants
const hostname =
    process.env.NODE_ENV === "production"
        ? "discernabu.cerner.corp"
        : "localhost";
const appPort = Number(process.env.APP_PORT) || 3001;
const jsServerPort = Number(process.env.PROCESS_PORT) || 3002;
const appUrl = `http://${hostname}:${appPort}`;
const jsServerUrl = `http://${hostname}:${jsServerPort}`;

const config: { [key: string]: ServerInfo } = {
    appServer: {
        hostname,
        port: appPort,
        url: appUrl,
        auth: {}
    },
    javaScriptServer: {
        hostname,
        port: jsServerPort,
        url: jsServerUrl,
        auth: {
            username: 'user',
            password: 'cpcUser' // change the password in deployed domain
        }
    }
};

export default config;

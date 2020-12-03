import * as React from "react";
import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import App from "./modules/app/App";
import configureStore, { history } from "./store";
import devState from "./store/dev-state";

ReactDOM.render(
    <App store={configureStore(devState)} history={history} />,
    document.getElementById("root")
);

registerServiceWorker();

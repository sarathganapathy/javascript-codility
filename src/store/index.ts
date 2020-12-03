import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import createHistory from "history/createBrowserHistory";
import { routerMiddleware } from "connected-react-router";
import rootReducer, { RootState, RootActions } from "../reducers";
import sagas from "../sagas";

declare var window: Window & {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function; // tslint:disable-line
};

// Create history utility which will be used in the router middleware
// ref: https://github.com/ReactTraining/history
export const history = createHistory();

// Create the saga middleware which will be used to connect the front end to the back end
// ref: https://github.com/redux-saga/redux-saga
const sagaMiddleware = createSagaMiddleware();

// Use the history utility to create the router middleware for react-router communication with the redux store
// Keeps the URL state in our application in sync with what is in the browser
// ref: https://github.com/reactjs/react-router-redux
const historyMiddleware = routerMiddleware(history);

/**
 * Configures the store in a production environment.
 * @param {Object} initialState - Initial state.
 * @returns {Store<RootState>} Redux store.
 */
const configureStoreProd = (initialState?: RootState) => {
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore<RootState, RootActions, {}, {}>(
        rootReducer(history),
        initialState!,
        composeEnhancers(applyMiddleware(sagaMiddleware, historyMiddleware))
    );

    sagaMiddleware.run(sagas);

    return store;
};

/**
 * Configures the store in a development environment.
 * @param {Object} initialState - Initial state.
 * @returns {Store<{}>} Redux store.
 */
const configureStoreDev = (initialState?: RootState) => {
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    // Initialize the store based on the development configuration
    const store = createStore<RootState, RootActions, {}, {}>(
        rootReducer(history),
        initialState!,
        composeEnhancers(applyMiddleware(sagaMiddleware, historyMiddleware))
    );

    sagaMiddleware.run(sagas);

    return store;
};

// Determine which configuration function to utilize based on the node environment
const configureStore =
    process.env.NODE_ENV === "production"
        ? configureStoreProd
        : configureStoreDev;

export default configureStore;

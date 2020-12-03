import { combineReducers } from "redux";
import {
    connectRouter,
    RouterState,
    RouterAction
} from "connected-react-router";
import { History } from "history";

/*
 * Combine different states to create the root state of the application
 */
export interface RootState {
    router: RouterState | undefined;
    app: any;
}

/*
 * Combine different actions to create the root actions of the application
 */
export type RootActions = RouterAction;

export default (history: History) =>
    combineReducers<RootState, RootActions>({
        /// @ts-ignore ignore this error
        router: connectRouter(history),
        app: combineReducers({})
    });

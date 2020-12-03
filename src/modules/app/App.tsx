import * as React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { Store } from "redux";
import { RootState, RootActions } from "../../reducers";
import { History } from "history";

type Props = {
    store: Store<RootState, RootActions>;
    history: History;
};

/**
 * Parent react component
 * @param {Store} store - redux store
 * @param {History} history - history
 * @returns {any}
 * @constructor
 */
const App: React.FC<Props> = ({ store, history }) => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
        <div> Coming soon, Only backend rest service is available. </div>
        </ConnectedRouter>
    </Provider>
);

export default App;


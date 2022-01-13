import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import reducers from './reducers/reducers';

export default function configureStore() {
  const middlewareEnhancer = applyMiddleware(thunk);

  const composedEnhancers = composeWithDevTools(middlewareEnhancer);

  const store = createStore(reducers, composedEnhancers);

  return store;
}

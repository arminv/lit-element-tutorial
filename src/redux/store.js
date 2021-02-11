import { createStore } from 'redux';
import { reducer } from './reducer.js';

// NOTE: this saves the application state in local storage so that the PWA has some data persistence when offline:
const STORAGE_KEY = '__todo_app__';

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadState = () => {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : undefined;
};

export const store = createStore(
  reducer,
  loadState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// NOTE: this will make sure we save the state in local storage all the time so it is available for PWA and when offline:
store.subscribe(() => {
  saveState(store.getState());
});

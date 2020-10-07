import { combineReducers, createStore } from 'redux';
import randomObjectsReducer from './randomObjects';
import * as selectorsRandomObjects from './randomObjects';

export const getXvalue = state => selectorsRandomObjects.getXvalue(state.randomObjects);
export const getRandomObjects = state => selectorsRandomObjects.getRandomObjects(state.randomObjects);
export const getHighlightObjects = state => selectorsRandomObjects.getHighlightObjects(state.randomObjects);
export const getRowPercentages = state => selectorsRandomObjects.getRowPercentages(state.randomObjects);

const rootReducer = combineReducers({
  randomObjects: randomObjectsReducer,
})

const store = createStore(rootReducer);

export default store;

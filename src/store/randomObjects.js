const SET_INPUT_VALUE = 'SET_INPUT_VALUE';
const ADD_ONE_OBJ = 'ADD_ONE_OBJ';
const DELETE_ROW = 'DELETE_ROW';
const ADD_ROW = 'ADD_ROW';
const FIND_X_OBJS = 'FIND_X_OBJS';
const RESET_X_OBJS = 'RESET_X_OBJS'
const SET_PERCENTAGES = 'SET_PERCENTAGES';
const RESET_PERCENTAGES = 'RESET_PERCENTAGES';

export const setInputValue = inputData => ({ type: SET_INPUT_VALUE, inputData });
export const addOneObj = objId => ({ type: ADD_ONE_OBJ, objId });
export const deleteRow = index => ({ type: DELETE_ROW, index });
export const addRow = nValue => ({ type: ADD_ROW, nValue });
export const findXobjs = (amount, id, xValue) => ({ type: FIND_X_OBJS, amount, id, xValue });
export const resetXobjs = () => ({ type: RESET_X_OBJS });
export const setPercentages = (sum, index) => ({ type: SET_PERCENTAGES, sum, index });
export const resetPercentages = () => ({ type: RESET_PERCENTAGES });

export const getXvalue = state => state.xValue;
export const getRandomObjects = state => state.randomObjects;
export const getHighlightObjects = state => state.highlightObjects;
export const getRowPercentages = state => state.rowPercentages;

const initialState = {
  randomObjects: [],
  highlightObjects: [],
  rowPercentages: [],
  xValue: 0,
};

const randomObjectsReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_INPUT_VALUE:
      const { mValue, nValue } = action.inputData;
      const mRows = [];
      for(let i = 1; i <= mValue; i++) {
        const nColumns = [];
        for(let j = 1; j <= nValue; j++) {
          nColumns.push({
            amount: Math.floor(Math.random()*(999-100+1)+100),
            id: (i+j*100),
          });
        }

        mRows.push(nColumns);
      }
      return {
        ...state,
        randomObjects: mRows,
        xValue: action.inputData.xValue,
      };
    case ADD_ONE_OBJ:
      const res = [...state.randomObjects].map(row => {
        return row.map(item => {
          if(item.id === action.objId) {
            return { ...item, amount: ++item.amount }
          }
          return item;
        });
      });
      return {
        ...state,
        randomObjects: res,
      };
    case DELETE_ROW:
      let filterObjs = state.randomObjects.filter((obj, i) => i !== action.index)
      if(state.randomObjects.length === 1) {
        filterObjs = [];
      }
      return {
        ...state,
        randomObjects: filterObjs,
      };
    case ADD_ROW:
      const copy = [...state.randomObjects];
      const nColumns = [];
      for(let j = 1; j <= action.nValue; j++) {
        nColumns.push({
          amount: Math.floor(Math.random()*(999-100+1)+100),
          id: (Date.now() + j*100),
        });
      }
      copy.push(nColumns);
      return {
        ...state,
        randomObjects: copy,
      };
    case FIND_X_OBJS:
      if(state.highlightObjects.length) {
        if(action.id === state.highlightObjects[0].id) {
          return {
            ...state,
          };
        }
      }
      let result = [];
      state.randomObjects.forEach(row => {
        row.map(item => result.push(item));
      });
      const diffs = [];
      for(let i = 0; i < result.length; i++) {
        diffs.push({ difference: Math.abs(result[i].amount - action.amount), id: result[i].id});
      }
      diffs.sort((a, b) => a.difference - b.difference);
      return {
        ...state,
        highlightObjects: diffs.slice(0, ++action.xValue),
      };
    case RESET_X_OBJS:
      return {
        ...state,
        highlightObjects: [],
      };
    case SET_PERCENTAGES:
      if(state.rowPercentages.length) {
        if(state.rowPercentages[0].id === state.randomObjects[action.index][0].id) {
          return {
            ...state,
          };
        }
      }
      const percentages = [...state.randomObjects[action.index]].map(item => {
        return { ...item, amount: (Math.round(item.amount/action.sum*100)/100).toFixed(2) }
      });
      return {
        ...state,
        rowPercentages: percentages,
      };
    case RESET_PERCENTAGES:
      return {
        ...state,
        rowPercentages: [],
      }
    default:
      return state;
  }
}

export default randomObjectsReducer;

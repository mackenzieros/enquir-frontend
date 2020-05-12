import { combineReducers } from 'redux';
import mainReducer from './MainReducer';
import notecardReducer from './NotecardReducer';

export default combineReducers({
  mainReducer,
  notecardReducer,
});
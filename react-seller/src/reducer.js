import { combineReducers } from 'redux'
import LoginReducer from './reducer/LoginReducer'
import MenuReducer from './reducer/MenuReducer';

const RootReducer = combineReducers({
  MenuReducer,
  LoginReducer
})

export default RootReducer;
import { combineReducers } from "redux";
import user from './user_reducer';

//combineReducer: store에 여러 Reducer를 rootReducer에서 하나로 합쳐줌.
const rootReducer = combineReducers({
    user
})

export default rootReducer;
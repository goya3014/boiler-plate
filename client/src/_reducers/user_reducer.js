import {
    LOGIN_USER, 
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

export default function(state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload } // ...state의 의미는 위의 state={}을 똑같이 가져오는 것.
            break;
        case REGISTER_USER:
            return {...state, registerSuccess: action.payload }
            break;
        case AUTH_USER:
            return {...state, userData: action.payload }
            break;
        default:
            return state;
    }
}
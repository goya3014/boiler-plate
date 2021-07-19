import Axios from 'axios'
import {
    LOGIN_USER 
} from './types';

export function loginUser(dataToSubmit) {

    const request = Axios.post('/api/users/login', dataToSubmit)
    .then(response => response.data)

    //type과 response로 구성된 action을 return
    return {
        type: "LOGIN_USER",
        payload: request
    }

}
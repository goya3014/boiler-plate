import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null){
    //option 종류 
    //null -> 아무나 출입이 가능한 페이지
    //true -> 로그인한 유저만 출입이 가능한 페이지
    //false -> 로그인한 유저는 출입이 불가능한 페이지

    //adminRoute : 관리자. 기본값은 null

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {
            //axios로 보내도 되지만 redux 사용
            dispatch(auth().then(response => {
                console.log(response)
            }))

        }, [])
        return(
            <SpecificComponent />
        )
    }

    
    return AuthenticationCheck
}
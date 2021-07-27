//React 라이브러리를 통해 useState를 가져올 수 있음.
import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';

function LoginPage(props) {

  const dispatch = useDispatch();

  //타이핑시 onChange 이벤트를 통해 State가 변경되면 value를 변경해줌.
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    //event.preventDefault()를 하지 않으면 버튼 클릭시 페이지가 계속 리프레시 됨. 
    event.preventDefault();

    let body = {
      email: Email,
      password: Password
    }
    //원래는 이곳에서 해야하는 axios post를 actions 폴더의 user_action에서 실행
    //Axios.post('/api/users/login', body).then(response => {})
      //redux 이용
      dispatch(loginUser(body))
        .then(response => {
          if(response.payload.loginSuccess){
              props.history.push('/')
          }else {
            alert('Error')
          }
        })
  }


  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form style={{displey:'flex', flexDirection:'column'}}
        onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <br/>
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br/>
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default withRouter(LoginPage);
import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';

function RegisterPage(props) {

  const dispatch = useDispatch();

  //타이핑시 onChange 이벤트를 통해 State가 변경되면 value를 변경해줌.
  const [Email, setEmail] = useState("")
  const [Name, setName] = useState("")
  const [Password, setPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")
  

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    //event.preventDefault()를 하지 않으면 버튼 클릭시 페이지가 계속 리프레시 됨. 
    event.preventDefault();

    if(Password !== ConfirmPassword){
      return alert('입력한 비밀번호가 같지 않습니다.')
    }

    let body = {
      email: Email,
      name: Name,
      password: Password
    }
    //원래는 이곳에서 해야하는 axios post를 actions 폴더의 user_action에서 실행
    //Axios.post('/api/users/login', body).then(response => {})
      //redux 이용
      dispatch(registerUser(body))
        .then(response => {
          if(response.payload.success){
              props.history.push('/login')
          }else {
            alert('Failed to sign up')
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
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />
        <br/>
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br/>
        <label>ConfirmPassword</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
        <br/>
        <button type="submit">
          Join
        </button>
      </form>
    </div>
  );
}

export default withRouter(RegisterPage);
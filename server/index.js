const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const {auth} = require('./middleware/auth');
const {User} = require("./models/User");
const config = require('./config/key');

const cookieParser = require('cookie-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//cookie-parser 사용하기
app.use(cookieParser()); 

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  . catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! hi'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.post('/api/users/register', (req, res) => {
  //회원가입시 필요한 정보들을 가져와 DB에 넣어준다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
  //요청된 이메일이 DB에 있는지 찾기. findOne: MongoDB에서 제공하는 함수
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다."
      })
    }
  //요청된 이메일이 DB에 있다면 비밀번호가 같은지 확인
  user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch){
      return res.json({ 
        loginSuccess: false,
         message: "비밀번호가 일치하지 않습니다." 
       })
    }
       //비밀번호가 같다면 User를 위한 token 생성
  user.generateToken((err, user) => {
          //status 400: error라는 의미
          if(err) return res.status(400).send(err);

          //토큰을 쿠키에 저장한다. * 로컬 컴퓨터나 세션 같은 곳에도 저장할 수 있지만 어느 곳이 제일 안전한지는 아직 논란이 있음. 
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
        })
  })
})
})//app.post 로그인 종료

//요청을 받아 콜백함수인 (req, res)를 사용하기 전 미들웨어인 auth를 사용할 것임.
app.get('/api/users/auth', auth, (req, res) => {
  //이곳까지 온것은 auth를 통과했음을 의미
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth : true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})
 

app.get('/api/users/logout', auth, (req, res) => {
  //유저를 찾아서 업데이트 해줌. 토큰은 ""으로 지워줌.

  User.findOneAndUpdate({_id: req.user._id},
     {token: ""}, 
     (err, user) => {
    if(err) return res.json({success: false, err});
    return res.status(200).send({
      success: true
    })
  })
})//logout api 종료


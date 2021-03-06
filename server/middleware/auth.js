const {User} = require('../models/User');

let auth = (req, res, next) => {
    //인증처리
    //1. 클라이언트 쿠키에서 토큰을 가져온다.(쿠키파서 이용)
    let token = req.cookies.x_auth;
    //2. 토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        //3. 유저가 없으면 인증 실패
        if(!user) return res.json({isAuth: false, error: true})

        //4. 유저가 있으면 인증 완료
        req.token = token;
        req.user = user;
        //next가 없으면 middleware에 갇혀버림.
        next();
    })
    
}

//auth를 다른 파일에서도 쓸 수 있도록 export
module.exports = {auth};
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//salt를 10자리로 설정
const saltRounds = 10
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})
//index.js에서 user 정보를 save하기 전에 메소드 실행. 메소드 실행 후 next 함수로 다시 save 메소드로 보냄.
userSchema.pre('save', function(next){    
    //위의 이름, 이메일 등의 스키마들을 가져옴.
    var user = this;
    //비밀번호 변경시에만 아래 로직을 타도록 함.
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
    //비밀번호를 암호화
})

//비밀번호 비교 함수 생성
userSchema.methods.comparePassword = function(plainPassword, cb){
    //입력된 비밀번호를 암호화하여 DB에 있는 비밀번호와 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })

}

//비밀번호 확인 후 토큰 생성 함수 만들기
userSchema.methods.generateToken = function(cb){
    var user = this;
    
    //jsonwebtoken을 이용해서 토큰을 생성하기
    //'secretToken'이라는 단어를 이용해 user의 id를 얻을 수 있음.
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token

    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해 유저 찾기
        //클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 확인

        user.findOne({"_id" : decoded, "token" : token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}
//스키마를 모델로 감쌈.
const User = mongoose.model('User', userSchema)

//모델을 다른 곳에서도 사용가능
module.exports = { User }
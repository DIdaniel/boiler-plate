const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    defult: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return enxt(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  // plainPassword 와 암호화 된 비밀번호가 같은지 확인하기
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err), callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function (callback) {
  var user = this;

  // jsonwebtoekn을 이용해서 token 생성하기
  var token = jwt.sign(user._id.toHexString(), "secreateToken");

  // user._id + 'secretToken' = token

  user.token = token;
  user.save(function (err, user) {
    if (err) return callback(err);
    callback(null, user);
  });
};

userSchema.statics.findByToken = function (token, callback) {
  var user = this;

  // 토큰을 decode 한다
  jwt.verify(token, "secreateToken", function (err, decoded) {
    //유저아이디를 이용해서 유저를 찾은 다음,
    // 클라이언트에서 가져온 Token과 DB에 보관 된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };

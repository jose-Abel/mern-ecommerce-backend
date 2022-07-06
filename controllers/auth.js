const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/user');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
  const user = new User(req.body);

  user.save((err, user)=> {
    if(err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }

    user.salt = undefined;
    user.hashed_password = undefined;

    res.json({
      user
    });
  });
}

exports.signin = (req, res) => {
  const {email, password} = req.body;
  User.findOne({email}, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exists. Please signup"
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password don't match"
      })
    }

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    res.cookie('t', token), {expire: new Date() + 9999};

    const {_id, name, email, role} = user;

    return res.json({
      token,
      user: {_id, email, name, role}
    });
  });
}

exports.signout  = (req, res) => {
  res.clearCookie('t');
  res.json({
    message: 'Signout successfull'
  });
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString();

  if(!user) {
    return res.status(403).json({
      error: "Access denied"
    });
  }

  next();
}

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resource! Access denied"
    });
  }
  next();
}
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

/* GET users listing. */
router.route('/')
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    User.find({}, function (err, user) {
        if (err) next(err);
        res.json(user);
    });
})

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username, email : req.body.email }),
      req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        if(req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            user.lastname = req.body.lastname;
        }        
        user.save(function(err,user) {
          passport.authenticate('local')(req, res, function () {
              return res.status(200).json({status: 'Registration Successful!'});
          });
        });
    });
});

// local authentication

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      
      var userInfo = {"username":user.username, "_id":user._id, "admin":user.admin};
      console.log('login: userInfo: ' + JSON.stringify(userInfo));
      var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
        res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

// facebook authentication - original
router.get('/facebook', passport.authenticate('facebook'),
  function(req, res){});

router.get('/facebook/callback', function(req,res,next){
  passport.authenticate('facebook', function(err, user, info) {
    if (err) {
      console.log()
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
        if (err) {
          return res.status(500).json({
            err: 'Could not log in user'
          });
        }
        var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
        res.status(200).json({
          status: 'Login successful!',
          success: true,
          token: token
        });
    });
  })(req,res,next);
});

router.post('/token', function (req, res, next) {
    var email = req.body.email;
    var username = req.body.username;
    User.findOne({'email': email}, function (err, user) {
        if (err) next(err);

        // if user exists, generate a token
        console.log('user: ' + JSON.stringify(user));
        if (user) {

            // generate a token
            console.log('generating a token!');
            var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
            res.status(200).json({
              status: 'Token Generated!',
              success: true,
              token: token
            });

        } 

        // otherwise, create a new user
        else {
            var newUser = new User({'username':username, 
                                    'firstname':username,
                                    'email':email
                                   });
            //User.create(newUser, function (err, user) {
            newUser.save(function (err) {
                if (err) next(err);
                console.log('new User created!');

                // generate a token
                var token = Verify.getToken({"username":newUser.username, "_id":newUser._id, "admin":newUser.admin});
                res.status(200).json({
                  status: 'Token Generated!',
                  success: true,
                  token: token
                });

            });
        }
    });
});

module.exports = router;
const LocalStrategy = require('passport-local').Strategy;
//const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User =  require('../models/User');
const Doctor =  require('../models/Doctor');

// module.exports = function(passport){
//     passport.use(
//         new LocalStrategy({usernameField: 'email'},(email,password,done) =>{
//             User.findOne({email: email})
//              .then(user => {
//                  if(!user){
//                      return done(null, false,{message: 'Email does not exist'});
//                  }

//                  bcrypt.compare(password,user.password, (err, isMatch) =>{
//                      if(err) throw err;
//                      if(isMatch){
//                          return done(null, user);
//                      }else{
//                         return done(null, false,{message: 'Incorrect Email or Password'});
//                      }
//                  });
//              })
//              .catch(err => console.log(err));
//         })
//     );

//     passport.serializeUser(function(user, done) {
//         done(null, user.id);
//       });
      
//       passport.deserializeUser(function(id, done) {
//         User.findById(id, function(err, user) {
//           done(err, user);
//         });
//       });
// }


function SessionConstructor(userId, userGroup, details) {
    this.userId = userId;
    this.userGroup = userGroup;
    this.details = details;
  }

const UserAuthentication = function(passport){
    passport.use(
        'local', new LocalStrategy({usernameField: 'email'},(email,password,done) =>{
            User.findOne({email: email})
             .then(user => {
                 if(!user){
                     return done(null, false,{message: 'Email does not exist'});
                 }

                 bcrypt.compare(password,user.password, (err, isMatch) =>{
                     if(err) throw err;
                     if(isMatch){
                         return done(null, user);
                     }else{
                        return done(null, false,{message: 'Incorrect Email or Password'});
                     }
                 });
             })
             .catch(err => console.log(err));
        })
    );

    passport.use(
        'local-2', new LocalStrategy({usernameField: 'email'},(email,password,done) =>{
            Doctor.findOne({email: email})
             .then(user => {
                 if(!user){
                     return done(null, false,{message: 'Email does not exist'});
                 }

                 bcrypt.compare(password,user.password, (err, isMatch) =>{
                     if(err) throw err;
                     if(isMatch){
                         return done(null, user);
                     }else{
                        return done(null, false,{message: 'Incorrect Email or Password'});
                     }
                 });
             })
             .catch(err => console.log(err));
        })
    );

    // passport.serializeUser(function(user, done) {
    //     done(null, user.id);
    //   });
      
    //   passport.deserializeUser(function(id, done) {
    //     User.findById(id, function(err, user) {
    //       done(err, user);
    //     });
    //   });

      passport.serializeUser(function (userObject, done) {
        // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
        let userGroup = "model1";
        let userPrototype =  Object.getPrototypeOf(userObject);
        if (userPrototype === User.prototype) {
          userGroup = "model1";
        } else if (userPrototype === Doctor.prototype) {
          userGroup = "model2";
        }
        let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
        done(null,sessionConstructor);
      });
      passport.deserializeUser(function (sessionConstructor, done) {
        if (sessionConstructor.userGroup == 'model1') {
          User.findOne({
              _id: sessionConstructor.userId
          }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
              done(err, user);
          });
        } else if (sessionConstructor.userGroup == 'model2') {
          Doctor.findOne({
              _id: sessionConstructor.userId
          }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
              done(err, user);
          });
        }
      });
}

module.exports = {
    UserAuthentication
}
const usersCtrl = {};

const { cleanSession } = require('../controllers/map.controller');

const User = require('../models/User');

const passport = require('passport');

usersCtrl.renderSingUp = (req, res) => {
  res.render('users/singup');
};

usersCtrl.singup = async (req,res) => {
  const { last_name, first_name, user, email, password, repassword } = req.body;
  const errors = [];

    if(password != repassword){
      errors.push({text: 'Contraseñas no coinciden'})
    }
    if(password.length < 5){
      errors.push({text: 'Contraseña con menos de 4 caracteres'})
    }
    if(errors.length > 0){
      //deberia pushear los errores al frontend
      res.render('users/singup',{ errors: errors});
    } else {
      const emailUser = await User.findOne({email:email});
      if(emailUser){
        req.flash('error_msg','Email ya ingresado');
        res.res.redirect('/user/singin');
      }
      const newUser = new User({
        last_name: last_name,
        first_name: first_name,
        user: user,
        email: email,
        password: password
      });

      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();

      req.flash('success_msg','Usuario creado correctamente.');
      res.redirect('/user/singin');
    }
};

usersCtrl.renderSingIn = (req,res) => {
  res.render('users/singin');
};

usersCtrl.singin = passport.authenticate('local', {
  successRedirect: '/map',
  failureRedirect: '/user/singin',
  failureFlash: true
});

usersCtrl.logout = (req,res) => {
  cleanSession();
  req.logout();
  res.redirect('/user/singin');
};

module.exports = usersCtrl;

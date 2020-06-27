const helpers = {};

helpers.isAuthenticated = (req,res,next) => {
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg', 'No se encuentra logeado.');
    res.redirect('/user/singin');
  }
}
module.exports = helpers;

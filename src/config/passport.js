const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'user'
}, async (user, password, done) => {
    const m_user = await User.findOne({user: user});
    if(!m_user) {
        return done(null,false,{message: 'Usuario no encontrado'});
    } else {
        const r_match = await m_user.matchPassword(password);
        if(r_match){
            return done(null,m_user);
        } else {
            return done(null,false,{message: 'Contraseña incorrecta'});
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null,user.id);
});

passport.deserializeUser((id, done) => {
 User.findById(id, (err, user) => {
    done(err,user);
 });
});

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const e_hbs = require('express-handlebars');
const Handlebars = require('handlebars')
const method_override = require('method-override');
const flash = require('connect-flash');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const cookieParser = require('cookie-parser');

//initialization
const app = express();

//settings
app.set('port', process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', e_hbs({
  defaltLayout: 'main',
  layoutDir: path.join(app.get('views'), 'layouts'),
  partialDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', '.hbs');

//middleware
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(method_override('_method'));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

//routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/map', require('./routes/map'));
app.use('/filter', require('./routes/filter'));

//static
app.use(express.static(path.join(__dirname,'public')));

module.exports = app;

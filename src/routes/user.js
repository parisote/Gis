const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');

const { renderSingUp, singup, renderSingIn, singin, logout } = require('../controllers/user.controller');

router.get('/singin', renderSingIn);

router.post('/singin',  singin);

router.get('/singup', renderSingUp);

router.post('/singup', singup)

router.get('/logout', isAuthenticated, logout);

module.exports = router;

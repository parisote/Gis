const router = require('express').Router();
const { isAuthenticated } = require('../helpers/auth');

const { renderFilter, renderFilterBy } = require('../controllers/filter.controller');

router.get('/', isAuthenticated ,renderFilter);

router.post('/', isAuthenticated ,renderFilterBy);

module.exports = router;

const router = require('express').Router();

const { isAuthenticated } = require('../helpers/auth');

const { renderMap,
  createMark,
  renderLayers,
  renderCreateLayers,
  createLayer,
  renderMapByLayer,
  getLayerById,
  updateLayer,
  deleteLayer,
  createCircle,
  createRectangle,
  createPolygon,
  renderMapFilter } = require('../controllers/map.controller');

//MAP
router.get('/', isAuthenticated, renderMap);
router.put('/', isAuthenticated, renderMapFilter);

//MARCAS
router.post('/createMark', isAuthenticated, createMark);
router.post('/createCircle', isAuthenticated, createCircle);
router.post('/createRectangle', isAuthenticated, createRectangle);
router.post('/createPolygon', isAuthenticated, createPolygon);

//LAYERS
router.get('/layers', isAuthenticated, renderLayers);
router.get('/layer/:id', isAuthenticated, getLayerById);
router.put('/layer/editLayer/:id', isAuthenticated, updateLayer);
router.delete('/layer/delete/:id', isAuthenticated, deleteLayer);
router.get('/createLayer', isAuthenticated, renderCreateLayers);
router.post('/createLayer', isAuthenticated, createLayer);

module.exports = router;

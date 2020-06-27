const mapCtrl = {};

const Neighborhood = require('../models/Neighborhood');
const Hospitals = require('../models/Hospitals');
const Layer = require('../models/Layer');

const Map = require('../models/Map');
const Circle = require('../models/Circle');

const passport = require('passport');

var _layer = 0;
var _hospitals = false;
var _neighborhood = false;

mapCtrl.createMark = async (req,res) => {
  const { lat, lng, layer, name } = req.body;
  const errors = [];

  const newMark = new Map({
    lat: lat,
    lng: lng,
    layer: layer,
    name: name
  });

  await newMark.save();

  req.flash('success_msg','Marca creada correctamente.');
  res.redirect('/map');
};

mapCtrl.renderMap = async (req,res) => {
  if(_layer != 0){
    const marks = await Map.find({layer:_layer});

    var json = '';
    json += '{';
    json += '\"type\": \"FeatureCollection\",';
    json += '\"features\": [';

    for(var i = 0; i < marks.length; i++){
      if(i != 0)
        json += ','
      json += '{';
      json += '\"type\": \"Feature\",'
      json += '\"geometry\": {'
      json += '\"type\": \"Point\",'
      json += '\"coordinates\": ['
      json += marks[i].lng+','
      json += marks[i].lat+''
      json += ']'
      json += '},'
      json += '\"properties\": {'
      json += '\"name\":\"'+ marks[i].name + '\"'
      json += '}'
      json += '}'
    }

    json += ']}';

    var c_json = '';
    const circle = await Circle.find({layer:_layer});
    if(circle.length > 0)
    {
      c_json += '{';
      c_json += '\"coordinates\": ['
      for(var x = 0; x < circle.length; x++){
        if(x != 0)
          c_json += ','
        c_json += '[';
        c_json += circle[x].lng+','
        c_json += circle[x].lat+','
        c_json += circle[x].radio+''
        c_json += ']';
      }
      c_json += "]}"
    }

    }

    if(_hospitals){
      const hosp = await Hospitals.find();

      var h_json = '';
      h_json += '{';
      h_json += '\"type\": \"FeatureCollection\",';
      h_json += '\"features\": [';

      for(var i = 0; i < hosp.length; i++){
        if(i != 0)
          h_json += ',';

        h_json += JSON.stringify(hosp[i].geo);
      }

      h_json += ']}';
    }

    if(_neighborhood){
      const nei = await Neighborhood.find();

      var n_json = '';
      n_json += '{';
      n_json += '\"type\": \"FeatureCollection\",';
      n_json += '\"features\": [';

      for(var i = 0; i < nei.length; i++){
        if(i != 0)
          n_json += ',';

          if(i != 0)
            n_json += ','
          n_json += '{';
          n_json += '\"type\": \"Feature\",'
          n_json += '\"geometry\": {'
          n_json += '\"type\": \"Polygon\",'
          n_json += '\"coordinates\":['
          n_json += JSON.stringify(nei[i].geo);
          n_json += ']},'
          n_json += '\"properties\": {'
          n_json += '\"name\":\"'+ nei[i].name + '\",'
          n_json += '\"department\":\"'+ nei[i].department + '\"'
          n_json += '}'
          n_json += '}'
      }

      n_json += ']}';
    }

    const layers = await Layer.find().or([{visible:"true"},{user:req.user.id}]);

    res.render('maps/map', {json, c_json, layers, h_json, n_json});
};

mapCtrl.renderMapFilter = (req,res) => {
  const { layer, hospitals, neighborhood } = req.body;

  _layer = layer;
  _hospitals = hospitals;
  _neighborhood = neighborhood;

  res.redirect('/map');
};

mapCtrl.renderLayers = async (req,res) => {
  const layers = await Layer.find().or([{visible:"true"},{user:req.user.id}]);

  res.render('maps/layer', { layers });
};

mapCtrl.renderCreateLayers = async (req,res) => {
  res.render('maps/createLayer');
};

mapCtrl.createLayer = async (req,res) => {
  const { description, code, visible } = req.body;
  const errors = [];

  const newLayer = new Layer({
    description: description,
    code: code,
    visible: visible,
  });

  newLayer.user = req.user.id;
  const nLayer = await newLayer.save();

  req.flash('success_msg','Capa creada correctamente.');
  res.redirect('/map/layers');
};

mapCtrl.getLayerById = async (req,res) => {
  const layer = await Layer.findById(req.params.id);
  res.render('maps/editLayer', { layer });
};

mapCtrl.updateLayer = async (req,res) => {
  const { description, visible } = req.body;
  await Layer.findByIdAndUpdate(req.params.id, { description, visible });
  req.flash("success_msg", "Layer actualizada correctamente.");
  res.redirect("/map/layers");
};

mapCtrl.deleteLayer = async (req, res) => {
  await Layer.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Capa borrada correctamente.");
  res.redirect("/map/layers");
};

mapCtrl.createCircle = async (req,res) => {
  const { lat, lng, radio, layer, name } = req.body;
  const errors = [];

  const newCircle = new Circle({
    lat: lat,
    lng: lng,
    radio: radio,
    layer: layer,
    name: name
  });

  await newCircle.save();

  req.flash('success_msg','Circulo creada correctamente.');
  res.redirect('/map');
};

mapCtrl.cleanSession = (req,res) => {
  _layer = '0';
  _hospitals = false;
  _neighborhood = false;
}

module.exports = mapCtrl;

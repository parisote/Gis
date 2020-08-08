const mapCtrl = {};

const db = require('mongoose');

const Neighborhood = require('../models/Neighborhood');
const Hospitals = require('../models/Hospitals');
const Layer = require('../models/Layer');
const PatientDiagnosis = require('../models/PatientDiagnosis');

const Map = require('../models/Map');
const Circle = require('../models/Circle');
const Rectangle = require('../models/Rectangle')

const passport = require('passport');

mapCtrl.renderMap = async (req,res) => {
  if(req.cookies.layer != 0){
    const marks = await Map.find({layer:req.cookies.layer});

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
    const circle = await Circle.find({layer:req.cookies.layer});
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

    var r_json = '';
    const rectangle = await Rectangle.find({layer:req.cookies.layer});
    if(rectangle.length > 0)
    {
      r_json += '{';
      r_json += '\"type\": \"FeatureCollection\",';
      r_json += '\"features\": [';
      for(var z = 0; z < rectangle.length; z++)
      {
        if(z != 0)
          r_json += ','
        r_json += '{';
        r_json += '\"type\": \"Feature\",'
        r_json += '\"geometry\": {'
        r_json += '\"type\": \"Polygon\",'
        r_json += '\"coordinates\": [['
        r_json += '['+rectangle[z].lng1+','
        r_json += rectangle[z].lat1+'],'
        r_json += '['+rectangle[z].lng2+','
        r_json += rectangle[z].lat2+'],'
        r_json += '['+rectangle[z].lng3+','
        r_json += rectangle[z].lat3+'],'
        r_json += '['+rectangle[z].lng4+','
        r_json += rectangle[z].lat4+']'
        r_json += ']]'
        r_json += '},'
        r_json += '\"properties\": {'
        r_json += '\"name\":\"'+ rectangle[z].name + '\"'
        r_json += '}'
        r_json += '}'
      }
      r_json += "]}"
    }
    console.log(r_json)
    }

    if(req.cookies.hospitals == 'on'){
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

    if(req.cookies.neighborhood == 'on'){
      const nei = await Neighborhood.find();

      var n_json = '';
      n_json += '{';
      n_json += '\"type\": \"FeatureCollection\",';
      n_json += '\"features\": [';

      for(var i = 0; i < nei.length; i++){
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

    if(req.cookies.diagnosis == 'on')
    {
      const dia = await PatientDiagnosis.find();

      var d_json = '';
      d_json += '{';
      d_json += '\"type\": \"FeatureCollection\",';
      d_json += '\"features\": [';

      for(var i = 0; i < dia.length; i++){
          if(i != 0)
            d_json += ','
          d_json += '{';
          d_json += '\"type\": \"Feature\",'
          d_json += '\"geometry\": {'
          d_json += '\"type\": \"Point\",'
          d_json += '\"coordinates\":'
          d_json += JSON.stringify(dia[i].geo);
          d_json += '},'
          d_json += '\"properties\": {'
          d_json += '\"name\":\"'+ dia[i].person_id + '\"'
          d_json += '}'
          d_json += '}'
      }
      d_json += ']}';
    }

    const layers = await Layer.find().or([{visible:"true"},{user:req.user.id}]);

    res.render('maps/map', {json, c_json, layers, h_json, n_json, d_json, r_json});
};

mapCtrl.renderMapFilter = (req,res) => {
  const { layer, hospitals, neighborhood, diagnosis } = req.body;

  if(layer){
    res.cookie('layer', layer, { expires: new Date(Date.now() + 900000), httpOnly: true });
  } else
    res.cookie('layer', false, { expires: new Date(Date.now() + 900000), httpOnly: true });

  if(hospitals){
    res.cookie('hospitals', hospitals, { expires: new Date(Date.now() + 900000), httpOnly: true });
  }else
    res.cookie('hospitals', false, { expires: new Date(Date.now() + 900000), httpOnly: true });

  if(neighborhood){
    res.cookie('neighborhood', neighborhood, { expires: new Date(Date.now() + 900000), httpOnly: true });
  }else
    res.cookie('neighborhood', false, { expires: new Date(Date.now() + 900000), httpOnly: true });

  if(diagnosis){
    res.cookie('diagnosis', diagnosis, { expires: new Date(Date.now() + 900000), httpOnly: true });
  }else
    res.cookie('diagnosis', false, { expires: new Date(Date.now() + 900000), httpOnly: true });

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

mapCtrl.createRectangle = async (req,res) => {
  const { point_1, point_2, point_3, point_4, point_5, point_6, point_7, point_8, layer,name } = req.body;
  const errors = [];

  const newRectangle = new Rectangle({
    lat1: point_1,
    lng1: point_2,
    lat2: point_3,
    lng2: point_4,
    lat3: point_5,
    lng3: point_6,
    lat4: point_7,
    lng4: point_8,
    layer: layer,
    name: name
  });

  await newRectangle.save();

  req.flash('success_msg','Circulo creada correctamente.');
  res.redirect('/map');
}

mapCtrl.cleanSession = (req,res) => {
  res.cookie('layer', false, { expires: new Date(Date.now() + 1), httpOnly: true });
  res.cookie('hospitals', false, { expires: new Date(Date.now() + 1), httpOnly: true });
  res.cookie('neighborhood', false, { expires: new Date(Date.now() + 1), httpOnly: true });
  res.cookie('diagnosis', false, { expires: new Date(Date.now() + 1), httpOnly: true });
}

module.exports = mapCtrl;

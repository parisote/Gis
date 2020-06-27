const filterCtrl = {};

const Neighborhood = require('../models/Neighborhood');
const Hospitals = require('../models/Hospitals');
const Layer = require('../models/Layer');

const Map = require('../models/Map');
const Circle = require('../models/Circle');

const passport = require('passport');

filterCtrl.renderFilter = async (req, res) => {
  const layers = await Layer.find().or([{visible:"true"},{user:req.user.id}]);

  res.render('filter/filter', {layers});
};

filterCtrl.renderFilterBy = async (req,res) => {
    const { layer, hospitals, neighborhood } = req.body;

    const marks = await Map.find({layer:layer});

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
    const circle = await Circle.find({layer:layer});
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

    if(hospitals){
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

    const layers = await Layer.find().or([{visible:"true"},{user:req.user.id}]);

    res.render('maps/map', {json, c_json, layers, h_json});

};

module.exports = filterCtrl;

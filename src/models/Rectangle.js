const { Schema, model } = require('mongoose');

const rectangleSchema = new Schema({
  lat1:
  {
    type: String
  },
  lng1:
  {
    type: String
  },
  lat2:
  {
    type: String
  },
  lng2:
  {
    type: String
  },
  lat3:
  {
    type: String
  },
  lng3:
  {
    type: String
  },
  lat4:
  {
    type: String
  },
  lng4:
  {
    type: String
  },
  layer:
  {
    type: Schema.Types.ObjectId, ref: 'Layer'
  },
  name:
  {
    type: String,
    required: true
  }
});

module.exports = model('Rectangle',rectangleSchema);

const { Schema, model } = require('mongoose');

const polygonSchema = new Schema({
  latlngs:
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

module.exports = model('Polygon',polygonSchema);

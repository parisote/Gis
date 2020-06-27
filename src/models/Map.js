const { Schema, model } = require('mongoose');

const mapSchema = new Schema({
  lat:
  {
    type: String
  },
  lng:
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

module.exports = model('Map',mapSchema);

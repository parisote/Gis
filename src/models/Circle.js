const { Schema, model } = require('mongoose');

const circleSchema = new Schema({
  lat:
  {
    type: String
  },
  lng:
  {
    type: String
  },
  radio:
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

module.exports = model('Circle',circleSchema);

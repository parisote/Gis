const { Schema, model } = require('mongoose');

const neiSchema = new Schema({
  name:
  {
    type: String
  },
  department:
  {
    type: Number
  },
  geo:
  {
    type: Array
  }
},{
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  }
});

module.exports = model('Neighborhood',neiSchema);

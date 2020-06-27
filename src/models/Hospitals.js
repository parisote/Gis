const { Schema, model } = require('mongoose');

const hSchema = new Schema({
  h_id:
  {
    type: Number
  },
  geo:
  {
    type: Object
  }
},{
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  }
});

module.exports = model('Hospitals',hSchema);

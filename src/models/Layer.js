const { Schema, model } = require('mongoose');

const layerSchema = new Schema({
  description:
  {
    type: String,
    required: true
  },
  code:
  {
    type: String,
    required: true
  },
  visible:
  {
    type: String,
    required: true
  },
  user:
  {
   type: Schema.Types.ObjectId, ref: 'User'
  }
},{
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  }
});

module.exports = model('Layer',layerSchema);

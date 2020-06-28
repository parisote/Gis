const { Schema, model } = require('mongoose');

const pDiagSchema = new Schema({
  p_id:
  {
    type: Number
  },
  nam:
  {
    type: String
  },
  diagnosis:
  {
    type: String
  },
  geo:
  {
    type: Array
  }
});

module.exports = model('PatientDiagnosis',pDiagSchema);

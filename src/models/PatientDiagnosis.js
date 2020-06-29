const { Schema, model } = require('mongoose');

const pDiagSchema = new Schema({
  person_id:
  {
    type: Number
  },
  name:
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

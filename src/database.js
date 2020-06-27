const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI;

mongoose.connect(URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('CONNET DB');
})

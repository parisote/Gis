require('dotenv').config();

const app = require('./app');
require('./database');
require('./config/passport');

async function main() {
  await app.listen(app.get('port'));
  console.log('Server en puerto',app.get('port'));
}

main();

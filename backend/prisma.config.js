const path = require('path');
// Cargamos las variables de entorno explícitamente desde el archivo .env
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};

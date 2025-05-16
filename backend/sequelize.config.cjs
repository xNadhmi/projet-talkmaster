require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql',
    logging: console.log,
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql',
    logging: false,
  },
};
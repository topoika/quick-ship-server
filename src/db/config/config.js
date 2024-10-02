require("dotenv").config();

const config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT,
    dialectOptions: {
      // useUTC: false, //for reading from database
      dateStrings: false,
      typeCast: true,
      connectTimeout: 600000,
    },
    logging: false,
    timezone: "+03:00",
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        ca: __dirname + "/ca-certificate.crt",
      },
      useUTC: false,
      dateStrings: true,
      typeCast: true,
      connectTimeout: 600000,
    },
    logging: false,
    pool: {
      max: 15,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+03:00",
  },
};

module.exports = config;

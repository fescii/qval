dbConfig = {
  HOST: process.env['POSTGRES_DB_HOST'],
  USER: process.env['POSTGRES_DB_USER'],
  PASSWORD: process.env['POSTGRES_DB_PASSWORD'],
  DB: process.env['POSTGRES_DB_NAME'],
  PORT: process.env['POSTGRES_DB_PORT'],
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

module.exports = dbConfig;
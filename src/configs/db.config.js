dbConfig = {
  HOST: process.env['POSTGRES_HOST'],
  USER: process.env['POSTGRES_USER'],
  PASSWORD: process.env['POSTGRES_PASSWORD'],
  DB: process.env['POSTGRES_DB'],
  PORT: process.env['POSTGRES_PORT'],
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// console.log(dbConfig);

module.exports = dbConfig;
require('dotenv').config(); // magic

module.exports = {
  "development": {
    "username"  : "postgres",
    "password"  : "p4ssw0rd",
    "database"  : "suratizin",
    "host"      : "127.0.0.1",
    "dialect"   : "postgres"
  },
  "production": {
    "username"      : process.env.PG_USERNAME,
    "password"      : process.env.PG_PASSWORD,
    "database"      : process.env.PG_DATABASE,
    "host"          : process.env.PG_HOST,
    "dialect"       : "postgres",
    "ssl"           : true,
    "dialectOptions": { "ssl": {"require":true} }
  },
  "redis": {
    "port": 16624,
    "host": process.env.REDIS_HOST,
    "auth": process.env.REDIS_AUTH,
    "db"  : process.env.REDIS_DB,
  },
  "redis_local": {
    "port": 3055,
    "host": "127.0.0.1"
  }
}

require("dotenv").config();
var mysql = require("mysql");
const logger = require("../util/log");

async function getConnection() {
  try {
    var connection = await mysql.createConnection({
      host: process.env.LOCALHOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,

      queryFormat: function (query, values) {
        if (!values) return query;
        return query.replace(
          /\:(\w+)/g,
          function (txt, key) {
            if (values.hasOwnProperty(key)) {
              return this.escape(values[key]);
            }
            return txt;
          }.bind(this)
        );
      },
    });
    connection.connect();
    console.log("Opened Connection");
  } catch (err) {
    logger.error(`❌ Creating db connection errored: ${err.message}`);
  }
  return connection;
}

module.exports = { getConnection };

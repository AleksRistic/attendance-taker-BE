var mysql = require("mysql");
const logger = require("../util/log");

async function getConnection() {
  try {
    var connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "taker",
      database: "attendance-taker",

      port: "3333",

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

const winston = require("winston");
const config = require("config");
require("express-async-errors");

process.on("unhandledRejection", (ex) => {
  throw ex;
});

winston.add(
  winston.createLogger({
    // level: config.get("log.level"),
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.printf((info) => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
      })
    ),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
  })
);

module.exports = winston;

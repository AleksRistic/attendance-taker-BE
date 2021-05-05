const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const multer = require("multer");
const bodyparser = require("body-parser");
const fileupload = require("express-fileupload");

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    const corsOptions = {
      credentials: true,
      origin: "http://localhost:3000",
    };

    // Set up CORS to allow only requests from the frontend domain
    this.server.use(cors(corsOptions));

    // Allow Preflight requests to work with CORS
    this.server.options("*", cors(corsOptions));

    // Allow JSON Requests
    this.server.use(express.json());

    this.server.use(bodyparser.json());
    this.server.use(fileupload({ createParentPath: true }));
  }
  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;

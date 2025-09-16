const express = require("express");
const app = express();
const config = require("config");
const winston = require("winston/lib/winston/config");


require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/dbStartup")();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || config.get("app.port");
app.listen(port, () => {
    winston.info("Listening on port " + port);
});
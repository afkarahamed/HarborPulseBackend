const express = require("express");
const app = express();
const config = require("config");

const log = require("./startup/logging");
require("./startup/routes")(app);
require("./startup/dbStartup")();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || config.get("app.port");
app.listen(port, () => {
    log.info("Listening on port " + port);
});
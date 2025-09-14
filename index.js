const express = require("express");
const app = express();
const config = require("config");


require("./startup/routes")(app);
require("./startup/dbStartup")();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || config.get("app.port");
app.listen(port, () => {
    console.log("Listening on port " + port);
});
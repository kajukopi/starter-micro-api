require("fix-esm").register();

require("dot-env");

const express = require("express");

const app = express();

const { engine } = require("express-handlebars");

const port = process.env.PORT || 3000;

app.engine(".hbs", engine({ extname: ".hbs" }));

app.set("view engine", ".hbs");

app.set("views", "./views");

app.enable("view cache");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("assets"));

const cors = require("cors");

app.use(cors());

// Routes
app.use("/api", require("./router/api"));

app.use("/", require("./router/index"));

// Server listening
app.listen(port, () => {
  console.log(`Server is running on http://localhost${port}`);
});

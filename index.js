require("fix-esm").register();

require("dot-env");

const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
const whitelist = ["http://localhost:3000", "http://localhost:5000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api", require("./router/api"));
app.use("/users", require("./router/users"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost${port}`);
});

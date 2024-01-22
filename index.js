require("fix-esm").register();

require("dot-env");

const express = require("express");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const whitelist = ["http://localhost", "https://teamkece.com"];

// Set up cors options
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false, // Do not include credentials in the CORS request
};

app.use(cors(corsOptions));

app.use("/api", require("./router/api"));

app.use("/users", require("./router/users"));

app.use("/status", require("./router/status"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

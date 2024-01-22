require("fix-esm").register();

require("dot-env");

const express = require("express");

const app = express();

const session = require("express-session");

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
const whitelist = ["http://localhost:3000", "http://localhost:5000", "https://teamkece.com"];

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

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if your server is running on HTTPS
      maxAge: 60000, // Session duration in milliseconds (e.g., 1 minute)
    },
  })
);

app.use("/api", require("./router/api"));
app.use("/users", require("./router/users"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost${port}`);
});

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

const whitelist = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://teamkece.com",
  "https://www.teamkece.com",
  "www.teamkece.com",
];

// Set up cors options
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

app.use("/status", require("./router/status"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  const axios = require("axios");

  // Function to fetch data
  async function fetchData() {
    try {
      const response = await axios.get("http://example.com/api/data");
      console.log("Data fetched:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  // Call fetchData immediately
  fetchData();

  // Call fetchData every minute
  setInterval(fetchData, 60000); // 60000 milliseconds = 1 minute
});

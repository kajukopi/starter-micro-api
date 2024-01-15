const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/", async (req, res) => {
  res.json({ status: true, data: "Hello world!" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port : " + process.env.PORT || 3000);
});

const express = require("express");
const router = express.Router();
const gs = require("./gs");

router.get("/:sheet", async (req, res) => {
  const sheet = req.params.sheet;
  gs.loadSheet(sheet)
    .then((result) => {
      const header = result[0]._worksheet._headerValues;
      const body = [];
      for (let i = 0; i < result.length; i++) {
        const element = result[i]._rawData;
        body.push(element);
      }
      console.log(header);
      console.log(body);
      res.json({ status: true, header, body });
    })
    .catch((error) => {
      console.log(error);
      res.json({ status: false });
    });
});

router.post("/:sheet", async (req, res) => {
  const sheet = req.params.sheet;
  const body = req.body;
  console.log(Object.values(body));
  console.log(Object.keys(body));
  gs.createSheet(sheet, ["name", "email"])
    .then((result) => {
      res.json({ status: true, result });
    })
    .catch((error) => {
      console.log(error);
      res.json({ status: false });
    });
});

module.exports = router;

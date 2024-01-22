const express = require("express");
const router = express.Router();
const { drive, doc } = require("../auth");

router.get("/", async (req, res) => {
  try {
    const token = req.rawHeaders.filter((item) => item.startsWith("Bearer"));
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["users"];
    const rows = await sheet.getRows();
    const find = gsToFind(rows, token[0].split(" ")[1]);
    res.json({ status: true, data: rows[find].get("email") });
  } catch (error) {
    res.json({ status: false, error });
  }
});

function gsToFind(rows, token) {
  let find = null;
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i];
    if (element.get("token") === token) find = i;
  }
  return find;
}

module.exports = router;

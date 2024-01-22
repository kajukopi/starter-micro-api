const express = require("express");
const router = express.Router();
const { drive, doc } = require("../auth");

router.get("/", async (req, res) => {
  console.log(req);
  try {
    const cookies = JSON.parse(req.cookies.user);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["users"];
    const rows = await sheet.getRows();
    const find = gsToFind(rows, cookies.email);
    console.log(find);
    res.json({ status: true });
  } catch (error) {
    res.json({ status: false, error });
  }
});

function gsToFind(rows, email) {
  let find = null;
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i];
    if (element.get("email") === email) find = i;
  }
  return find;
}

module.exports = router;

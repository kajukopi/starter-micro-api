const express = require("express");
const router = express.Router();
const {  doc } = require("../auth");

router.get("/", async (req, res) => {
  try {
    const [token] = req.rawHeaders.filter((item) => item.startsWith("Bearer"));
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["users"];
    const rows = await sheet.getRows();
    const find = gsToFind(rows, token.split(" ")[1]);
    if (find === null) throw "Silahkan login terlebih dahulu!";
    res.json({ status: true, data: { email: rows[find].get("email"), name: rows[find].get("name") } });
  } catch (error) {
    res.json({ status: false, error });
  }
});

router.get("/logout", async (req, res) => {
  try {
    const [token] = req.rawHeaders.filter((item) => item.startsWith("Bearer"));
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["users"];
    const rows = await sheet.getRows();
    const find = gsToFind(rows, token.split(" ")[1]);
    if (find === null) throw "Silahkan login terlebih dahulu!";
    rows[find].assign({ token: "" });
    await rows[find].save();
    res.json({ status: true, data: { email: rows[find].get("email"), name: rows[find].get("name") } });
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

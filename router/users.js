const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const bcrypt = require("bcrypt");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });
const { drive, doc } = require("../auth");
const saltRounds = 10;

router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["users"];
    const rows = await sheet.getRows();
    if (gsToFind(rows, body.email) !== null) throw "Email sudah terdaftar!";
    const id = uid.rnd();
    body.password = await bcrypt.hash(body.password, saltRounds);
    await sheet.addRow({ ...body, id });
    res.json({ status: true, data: { ...body, id } });
  } catch (error) {
    res.json({ status: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["users"];
    const rows = await sheet.getRows();
    const find = gsToFind(rows, body.email);
    if (find === null) res.json({ status: false, data: "Data not exist!" });
    const id = rows[find].get("id");
    const email = rows[find].get("email");
    const password = rows[find].get("password");
    const verify = await bcrypt.compare(body.password, password);
    if (!verify) throw "Email & Password salah!";
    res.json({ status: true, data: { username: body.name, email, id } });
  } catch (error) {
    res.json({ status: false, error });
  }
});

function gsToArray(rows, req) {
  const header = rows[0]._worksheet._headerValues;
  const body = [];
  for (let i = 0; i < rows.length; i++) {
    body.push(rows[i]._rawData);
  }

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || rows.length;

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const itemsForPage = body.slice(startIndex, endIndex);

  // console.log(itemsForPage);

  return { header, body: itemsForPage };
}

function gsToFind(rows, email) {
  let find = null;
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i];
    if (element.get("email") === email) find = i;
  }
  return find;
}

// const myPlaintextPassword = "team_keces0//P4$$w0rD";
// const someOtherPlaintextPassword = "team_kece";
// let hashPassword = "$2b$10$RIwie7BNdzjXIOu5oEmbQ./CMfg8sV4EnisdP7O7SYVADNHenSGYC";
// (async () => {
//   const one = await bcrypt.hash(myPlaintextPassword, saltRounds);
//   const two = await bcrypt.compare(myPlaintextPassword, hashPassword);
//   const three = await bcrypt.compare(someOtherPlaintextPassword, hashPassword);
//   console.log(one, two, three);
// })();

module.exports = router;

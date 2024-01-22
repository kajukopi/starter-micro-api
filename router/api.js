const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const bcrypt = require("bcrypt");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });
const { drive, doc } = require("../auth");

router.get("/:title", async (req, res) => {
  try {
    const title = req.params.title;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[title];
    const rows = await sheet.getRows();
    if (rows.length === 0) res.json({ status: true, data: [], length: 0 });
    res.json({ status: true, data: gsToArray(rows, req), length: rows.length });
  } catch (error) {
    res.json({ status: false, error });
  }
});

router.post("/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const body = req.body;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[title];
    const id = uid.rnd();
    await sheet.addRow({ ...body, id });
    res.json({ status: true, data: { ...body, id } });
  } catch (error) {
    res.json({ status: false });
  }
});

router.delete("/:title/:id", async (req, res) => {
  try {
    const title = req.params.title;
    const body = req.body;
    const id = req.params.id;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[title];
    const rows = await sheet.getRows();
    rows[gsToFind(rows, id)].delete();
    res.json({ status: true });
  } catch (error) {
    res.json({ status: false });
  }
});

router.put("/:title/:id", async (req, res) => {
  try {
    const title = req.params.title;
    const body = req.body;
    const id = req.params.id;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[title];
    const rows = await sheet.getRows();
    rows[gsToFind(rows, id)].assign(body);
    await rows[gsToFind(rows, id)].save();
    res.json({ status: true });
  } catch (error) {
    console.log(error);
    res.json({ status: false });
  }
});

// File upload endpoint
router.post("/upload/:title", upload.single("file"), async (req, res) => {
  const fileData = req.file;
  if (!fileData) {
    return res.status(400).send("No file uploaded.");
  }

  const fileMetadata = {
    name: fileData.originalname,
  };

  const media = {
    mimeType: fileData.mimetype,
    body: fileData.buffer,
  };
  console.log(fileMetadata, media);
  try {
    // const response = await gs.drive.files.create({
    //   resource: fileMetadata,
    //   media: media,
    //   fields: "id",
    // });

    // const fileId = response.data.id;

    // // Inserting a link to the image in the Google titles
    // const spreadsheetId = "YOUR_SPREADSHEET_ID";
    // const sheetName = "Sheet1"; // Modify as per your sheet name
    // const range = `${sheetName}!A1`;

    // const request = {
    //   spreadsheetId: spreadsheetId,
    //   range: range,
    //   valueInputOption: "RAW",
    //   resource: {
    //     values: [[`=HYPERLINK("https://drive.google.com/file/d/${fileId}", "View Image")`]],
    //   },
    // };

    // await sheets.spreadsheets.values.update(request);

    res.send(`File uploaded. Image link added to the spreadsheet.`);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file.");
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

function gsToFind(rows, id) {
  let find = null;
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i];
    if (element.get("id") === id) find = i;
  }
  return find;
}

// const saltRounds = 10;
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

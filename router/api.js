const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });
const { drive, doc, permission, createSheet } = require("../auth");

router.get("/:title", async (req, res) => {
  try {
    const title = req.params.title;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[title];
    const rows = await sheet.getRows();
    if (rows.length === 0) return res.json({ status: true, data: [], length: 0 });
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
    if (title === "rundown")
      await createSheet(id, [
        "summary",
        "description",
        "start_date",
        "end_date",
        "start_datetime",
        "end_datetime",
        "color_background",
        "color_foreground",
      ]);
    res.json({ status: true, data: { ...body, id } });
  } catch (error) {
    res.json({ status: false, error });
    console.log(error);
  }
});

router.delete("/:title/:id", async (req, res) => {
  try {
    const title = req.params.title;
    const id = req.params.id;
    const query = { col: req.query.col, id: req.query.id };
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[title];
    const rows = await sheet.getRows();
    if (gsToFindCustom(rows, query.col, query.id) === null) throw "Data not found!";
    rows[gsToFindCustom(rows, query.col, query.id)].delete();
    res.json({ status: true });
  } catch (error) {
    res.json({ status: false, error });
  }
});

router.put("/:title/:id", async (req, res) => {
  try {
    const title = req.params.title;
    const body = req.body;
    const id = req.params.id;
    const query = { col: req.query.col, id: req.query.id };
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[title];
    const rows = await sheet.getRows();
    if (gsToFindCustom(rows, query.col, query.id) === null) throw "Data not found!";
    console.log(JSON.stringify(body));
    rows[gsToFindCustom(rows, query.col, query.id)].assign(body);
    await rows[gsToFindCustom(rows, query.col, query.id)].save();
    res.json({ status: true });
  } catch (error) {
    console.log(error);
    res.json({ status: false, error });
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

function gsToFindCustom(rows, col, id) {
  let find = null;
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i];
    if (element.get("start_datetime").indexOf(id) || element.get("start_datetime") === id) find = i;
  }
  return find;
}

module.exports = router;

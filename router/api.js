const express = require("express");
const router = express.Router();
const gs = require("../gs");
const multer = require("multer");

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
      res.json({ status: true, header, body });
    })
    .catch((error) => {
      console.log(error);
      res.json({ status: false });
    });
});

router.post("/create/:sheet", async (req, res) => {
  console.log(req.body);
  gs.createSheet(req.params.sheet, Object.keys(req.body))
    .then((result) => {
      if (result.length === 0) return res.json({ status: true, header: Object.keys(req.body), body: [] });
      const header = result[0]._worksheet._headerValues;
      const body = [];
      for (let i = 0; i < result.length; i++) {
        const element = result[i]._rawData;
        body.push(element);
      }
      res.json({ status: true, header, body });
    })
    .catch((error) => {
      console.log(error);
      res.json({ status: false });
    });
});

router.post("/push/:sheet", async (req, res) => {
  const sheet = req.params.sheet;
  const body = req.body;
  console.log(body);
  gs.push(sheet, body)
    .then((result) => {
      const header = result._worksheet._headerValues;
      const body = result._rawData;
      res.json({ status: true, header, body });
    })
    .catch((error) => {
      console.log(error);
      res.json({ status: false });
    });
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// File upload endpoint
router.post("/upload/:sheet", upload.single("file"), async (req, res) => {
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

    // // Inserting a link to the image in the Google Sheets
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
module.exports = router;

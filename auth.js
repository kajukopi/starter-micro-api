const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const { google } = require("googleapis");

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({
  version: "v3",
  auth: serviceAccountAuth,
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);

async function permission(req, res, next) {
  try {
    const token = req.rawHeaders.filter((item) => item.startsWith("Bearer"));
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["users"];
    const rows = await sheet.getRows();
    const find = gsToFind(rows, token[0].split(" ")[1]);
    if (!find) throw "Silahkan login terlebih dahulu!";
    next({ status: true, data: rows[find].get("email") });
  } catch (error) {
    res.json({ status: false, error });
  }
}

module.exports = { drive, doc, permission };

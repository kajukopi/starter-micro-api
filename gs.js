// Google Spread Sheets
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"],
});
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);
// console.log(process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"));

const gs = {
  createSheet: async (title, headerValues) => {
    try {
      await doc.loadInfo();
      let sheet = doc.sheetsByTitle[title];
      if (!sheet) {
        sheet = await doc.addSheet({ title, headerValues });
      }
      const rows = await sheet.getRows();
      return rows;
    } catch (error) {
      console.error("Error:", error.message);
      return error;
    }
  },
  loadSheet: async (title) => {
    try {
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle[title];
      const rows = await sheet.getRows();
      return rows;
    } catch (error) {
      console.error("Error:", error.message);
      return error;
    }
  },
};

module.exports = gs;

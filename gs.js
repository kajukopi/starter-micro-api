// Google Spread Sheets
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

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
// console.log(process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"));

const gs = {
  createSheet: async (title, headerValues) => {
    try {
      await doc.loadInfo();
      let sheet = doc.sheetsByTitle[title];
      if (!sheet) {
        sheet = await doc.addSheet({ title, headerValues });
        const rows = await sheet.getRows();
        return rows;
      } else {
        const rows = await sheet.getRows();
        return rows;
      }
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

  push: async (title, body) => {
    try {
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle[title];
      const data = await sheet.addRow(body);
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      return error;
    }
  },

  delete: async () => {
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

  add: async () => {
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
  drive: drive,
};

// File details
const localFilePath = path.join(__dirname, "/", "image.jpeg");
const fileName = "image.jpeg";
const fileContent = fs.createReadStream(localFilePath);

// Upload file to Google Drive
async function uploadFile() {
  try {
    const folderId = "1i2dXMp9qZOdMM0RNE7xcU8ZrdIGs0hl9"; // Replace with the actual folder ID
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: "image/jpeg",
        body: fileContent,
      },
    });

    console.log("File uploaded. File ID:", response.data.id);
  } catch (error) {
    console.error("Error uploading file:", error.message);
  }
}

// uploadFile();

async function listFiles() {
  try {
    const response = await drive.files.list({
      // pageSize: 10, // Number of files to retrieve (adjust as needed)
      fields: "files(id, name, mimeType)", // Specify the fields you want to retrieve
    }); 
    const files = response.data.files;
    if (files.length) {
      console.log("Files found:");
      files.forEach((file) => {
        console.log(`${file.name} (${file.id}, ${file.mimeType})`);
      });
    } else {
      console.log("No files found.");
    }
  } catch (error) {
    console.error("Error listing files:", error.message);
  }
}

// listFiles();

module.exports = gs;

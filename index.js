const express = require("express");
const app = express();
const port = 3000;

// Google Spread Sheets
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);
// console.log(process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"));

// Middleware
app.use(cors());
app.use(express.json());

// Data Dummy
let data = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  // ... (Tambahkan data sesuai kebutuhan)
];

// Routes
app.get("/api/items", (req, res) => {
  res.json(data);
});

app.get("/api/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = data.find((item) => item.id === id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.json(item);
});

app.post("/api/items", (req, res) => {
  const newItem = req.body;
  newItem.id = data.length + 1;
  data.push(newItem);

  res.status(201).json(newItem);
});

app.put("/api/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedItem = req.body;
  const index = data.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  data[index] = { ...data[index], ...updatedItem };

  res.json(data[index]);
});

app.delete("/api/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  data = data.filter((item) => item.id !== id);

  res.json({ message: "Item deleted" });
});

// Server listening
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost`);
});

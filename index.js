const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

// Data Dummy
let data = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  // ... (Tambahkan data sesuai kebutuhan)
];



// Routes
app.use("/", require("./router"));

// app.get("/api/items/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const item = data.find((item) => item.id === id);

//   if (!item) {
//     return res.status(404).json({ message: "Item not found" });
//   }

//   res.json(item);
// });

// app.post("/api/items", async (req, res) => {
//   const newItem = req.body;
//   newItem.id = data.length + 1;
//   data.push(newItem);

//   res.status(201).json(newItem);
// });

// app.put("/api/items/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const updatedItem = req.body;
//   const index = data.findIndex((item) => item.id === id);

//   if (index === -1) {
//     return res.status(404).json({ message: "Item not found" });
//   }

//   data[index] = { ...data[index], ...updatedItem };

//   res.json(data[index]);
// });

// app.delete("/api/items/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   data = data.filter((item) => item.id !== id);

//   res.json({ message: "Item deleted" });
// });

// Server listening
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost`);
});

const express = require("express");
const router = express.Router();
const { drive, doc } = require("../auth");

router.get("/", async (req, res) => {
  console.log(req.cookies.user);
  try {
    const cookies = JSON.parse(req.cookies.user);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["users"];
    const rows = await sheet.getRows();
    const find = gsToFind(rows, cookies.email);
    console.log(rows[find].get("last_login"));

    // The target date
    const targetDate = new Date(rows[find].get("last_login"));

    // The current date and time
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = currentDate.getTime() - targetDate.getTime();

    // Convert the time difference to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    console.log("Hours difference:", hoursDifference);

    res.json({ status: true });
  } catch (error) {
    res.json({ status: false });
  }
});

function gsToFind(rows, email) {
  let find = null;
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i];
    if (element.get("email") === email) find = i;
  }
  return find;
}

module.exports = router;

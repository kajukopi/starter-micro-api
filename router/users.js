const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const ShortUniqueId = require("short-unique-id")
const uid = new ShortUniqueId({length: 10})
const bearer = new ShortUniqueId({length: 100})
const {doc} = require("../auth")
const saltRounds = 10

router.post("/register", async (req, res) => {
  try {
    const body = req.body
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle["users"]
    const rows = await sheet.getRows()
    if (gsToFind(rows, body.email) !== null) throw "Email sudah terdaftar!"
    const id = uid.rnd()
    body.password = await bcrypt.hash(body.password, saltRounds)
    await sheet.addRow({...body, id})
    res.json({status: true, data: {...body, id}})
  } catch (error) {
    res.json({status: false, error})
  }
})

router.post("/login", async (req, res) => {
  try {
    const body = req.body
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle["users"]
    const rows = await sheet.getRows()
    const find = gsToFind(rows, body.email)
    if (find === null) throw "Data tidak valid!"
    const password = rows[find].get("password")
    const verify = await bcrypt.compare(body.password, password)
    if (!verify) throw "Email & Password salah!"
    const token = bearer.rnd()
    rows[find].assign({last_login: new Date().toISOString(), token})
    await rows[find].save()
    res.json({status: true, data: {token}})
  } catch (error) {
    res.json({status: false, error})
  }
})

function gsToArray(rows, req) {
  const header = rows[0]._worksheet._headerValues
  const body = []
  for (let i = 0; i < rows.length; i++) {
    body.push(rows[i]._rawData)
  }

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.pageSize) || rows.length

  const startIndex = (page - 1) * pageSize
  const endIndex = page * pageSize

  const itemsForPage = body.slice(startIndex, endIndex)

  // console.log(itemsForPage);

  return {header, body: itemsForPage}
}

function gsToFind(rows, email) {
  let find = null
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i]
    if (element.get("email") === email) find = i
  }
  return find
}

module.exports = router

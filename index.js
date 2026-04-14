import bodyParser from "body-parser";
import express from 'express'
const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/healthCheck', (req, res) => {
  res.status(200).json({mensaje:'Todo marcha bien!'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

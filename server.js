import bodyParser from "body-parser";
import express from 'express'
import {configureRoutes} from "./routes.js";

export const startServer = (app, port) => {
  app.use(bodyParser.json())

  app.get('/healthCheck', (req, res) => {
    res.status(200).json({mensaje:'Todo marcha bien!'})
  })

  configureRoutes(app)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  return app;
}
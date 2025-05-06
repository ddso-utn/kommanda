import bodyParser from "body-parser";
import {configureRoutes} from "./routes.js";

export const startServer = (app, port, appContext) => {
  app.use(bodyParser.json())

  app.get('/healthCheck', (req, res) => {
    res.status(200).json({mensaje:'Todo marcha bien!'})
  })

  configureRoutes(app, appContext)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  return app;
}
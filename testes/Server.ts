import express from "express"
import http from "http"
import cors from "cors"

const app = express()

const httpServer = new http.Server(app)
const port = 8080

import Router from "./src/routers/Router"
import Middle from "./src/filters/filter"

app.use(express.json())
//app.use(Middle)
app.use(cors({origin: "*"}))

app.use(Router)

//https://serverwikimedic.andredias52.repl.co/

httpServer.listen(port || 3030, ()=>{
  console.log("httpServer listening https://serverwikimedic.andredias52.repl.co/ in" + port)
})

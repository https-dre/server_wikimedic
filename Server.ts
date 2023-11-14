import express from "express"
import http from "http"
import cors from "cors"

const app = express()

const httpServer = new http.Server(app)
const port = 8080

import Router from "./src/routers/Router"
//import Middle from "./src/filters/filter"

import { mongo as ClientMongo } from "./src/data/mongoDB/conn"
//import { mongo } from "mongoose"

const main = async () => {
  ClientMongo.conn() // conectando ao banco de dados antes de iniciar a aplicação
  app.use(express.json())
  //app.use(Middle)
  app.use(cors({ origin: "*" })) // permitindo qualquer origem se conectar ao banco de dados

  app.use(Router) // colocando o arquivo ./src/routers/Router.ts para gerenciar as rotas da aplicação

  //https://serverwikimedic.andredias52.repl.co/

  httpServer.listen(port || 3030, () => {
    console.log("httpServer listening in " + port)
  })
}



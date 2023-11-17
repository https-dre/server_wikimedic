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
  await ClientMongo.conn() // conectando ao banco de dados antes de iniciar a aplicação
  // criando coleções no banco de dados
  //await ClientMongo.db.createCollection("User")
  //await ClientMongo.db.createCollection("Medicamentos")
  //await ClientMongo.db.createCollection("Favorito")
  
  app.use(express.json())
  //app.use(Middle) //Middleware é um filtro de Acesso para o Servidor 
  app.use(cors({ origin: "*" })) // permitindo qualquer origem se conectar ao ao Servidor

  app.use(Router) // colocando o arquivo ./src/routers/Router.ts para gerenciar as rotas da aplicação

  //https://serverwikimedic.andredias52.repl.co/

  httpServer.listen(port || 3030, () => {
    console.log("\nhttpServer listening in " + port)
  })
}

main()


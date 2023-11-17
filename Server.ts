import express from "express"
import http from "http"
import cors from "cors"

const app = express()

const httpServer = new http.Server(app)
const port = 8080

import Router from "./src/routers/Router"
//import Middle from "./src/filters/filter"

import { mongo as ClientMongo } from "./src/data/mongoDB/conn"

const main = async () => {
  try
  {
    await ClientMongo.conn() // conectando ao banco de dados antes de iniciar a aplicação
    app.use(express.json())
    //app.use(Middle) //Middleware é um filtro de Acesso para o Servidor 
    app.use(cors({ origin: "*" })) // permitindo qualquer origem se conectar ao ao Servidor

    app.use(Router) // colocando o arquivo ./src/routers/Router.ts para gerenciar as rotas da aplicação

    httpServer.listen(port || 3030, () => {
      console.log("\nhttpServer listening in " + port)
    })
  }
  catch (err)
  {
    console.log(err)
  }
}

main()


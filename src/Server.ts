import express from "express"
import http from "http"
import cors from "cors"

const app = express()

const httpServer = new http.Server(app)
const port = 8080

import Router from "./routers/Router"
//import Middle from "./src/filters/filter"

import { mongo as ClientMongo } from "./data/mongoDB/conn"

const configureCORS = () => {
  app.use(cors());
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
};

const main = async () => {
  try {
    await ClientMongo.conn(); // Conectando ao banco de dados antes de iniciar a aplicação
    configureCORS(); // Configuração do CORS
    app.use(express.json());
    // app.use(Middle); // Middleware é um filtro de Acesso para o Servidor
    app.use(Router); // Colocando o arquivo ./src/routers/Router.ts para gerenciar as rotas da aplicação

    httpServer.listen(port || 3030, () => {
      console.log("\nhttpServer listening in " + port);
    });
  } catch (err) {
    console.log(err);
  }
};

main();


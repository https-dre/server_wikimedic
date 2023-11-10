import { Request, Response, NextFunction } from "express";
const api_key = "12387"

const Middle = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && 'key' in req.body) {
      const { key } = req.body;
      if(key == api_key)
      {
        next()
      }
      else
      {
        res.status(401).json({message: "Acesso negado"})
      }
    } 
    else {
      // Trate o caso em que 'key' não está presente em req.body
      res.status(401).json({message : "Sem Chave de Acesso"})
    }
  }
  catch (err)
  {
    console.log(err)
    res.status(500).json({message : "Erro Interno no Servidor"})
  }
  
};

export default Middle;
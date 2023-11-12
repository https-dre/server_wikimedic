import { Client } from "pg"
import { clientModel } from "./postgre"

export class PostgreController {

    async get(query : string) : Promise<[] | any> {
        try {
            const client = new Client(clientModel)
            await client.connect()
            const queryResult = await client.query(query)
            /* await client.end() */


            //removendo os espaços nos finais dos atributos string
            for (let obj of queryResult.rows) {
                for (let key in obj) {
                    if (typeof obj[key] === 'string') {
                        obj[key] = obj[key].replace(/\s+$/, '');
                    }
                }
            }
            
            
            return queryResult.rows
        }
        catch (err)
        {
            throw err
        }
    }
    async run(query : string) : Promise<void> {
        try {
            const client = new Client(clientModel)
            await client.connect()
            
            const queryResult = await client.query(query)
            //console.log()
            /* await client.end() */
        }
        catch (err)
        {
            throw err
        }
    }
}
import { client } from "./postgre"

export class PostgreController {

    async get(query : string) : Promise<[] | any> {
        try {
            await client.connect()
            const queryResult = client.query(query)
            await client.end()
            return queryResult
        }
        catch (err)
        {
            throw err
        }
    }
    async run(query : string) : Promise<void> {
        try {
            await client.connect()
            const queryResult = client.query(query)
            await client.end()
        }
        catch (err)
        {
            throw err
        }
    }
}
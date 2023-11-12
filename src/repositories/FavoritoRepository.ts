import { Favorito } from "../models/Favorito";
import { PostgreController } from "../data/Client";
import { v4 as uuidv4 } from 'uuid';

interface IFavRepository {
    postFav(fav : Favorito): Promise<Favorito>;
    findByIdUser(id : string): Promise<Favorito[] | false>;
}

export class FavRepository implements IFavRepository {
    db : PostgreController

    constructor(pg : PostgreController)
    {
        this.db = pg
    }

    async postFav(fav: Favorito): Promise<Favorito> {
        try
        {
            const query = `INSERT INTO favoritos (id, idUser, idMed) VALUES ('${fav.id}','${fav.idUser}','${fav.idMed}')`
            await this.db.run(query)
            return fav
        }
        catch (err)
        {
            throw err
        }
    }
    async findByIdUser(id: string): Promise<Favorito[] | false> {
        try {
            const query = `SELECT * FROM favoritos WHERE id = '${id}'`
            const result = await this.db.get(query)

            if(result.length > 0)
            {
                return result
            }
            else
            {
                return false
            }
        }
        catch (err)
        {
            throw err
        }
    }
}
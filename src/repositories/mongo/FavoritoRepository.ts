import { IFavoritoRepository } from "../protocols/IFavoritoRepository"
import { mongo } from "../../data/mongoDB/conn"
import { ObjectId } from "mongodb"
import { Favorito } from "../../models/Favorito"
import { toFavorito } from "../../utils/ToFavorito"

export class FavoritoRepository implements IFavoritoRepository
{
    async postFav(fav : Favorito): Promise<Favorito>
    {
        try {
            const FavoritoCollection = mongo.db.collection('Favorito')
            await FavoritoCollection.deleteMany({_id : null as unknown as ObjectId, idUser : null})

            const doc = await FavoritoCollection.insertOne({
                _id : fav.id as unknown as ObjectId,
                idUser : fav.idUser,
                idMed : fav.idMed,
                numProcesso : fav.numProcesso
            })

            return {
                id : doc.insertedId as unknown as string,
                idUser : fav.idUser,
                idMed : fav.idMed,
                numProcesso : fav.numProcesso
            }
        } 
        catch (err) {
            throw err;
        }
    }

    async findByIdUser(id : string): Promise<Favorito[] | null>
    {
        try {
            const FavoritoCollection = mongo.db.collection('Favorito')
            const docs = await FavoritoCollection.find({_id : id as unknown as ObjectId}).toArray()
            if(docs.length > 0)
            {
                const favs = docs.map(doc => toFavorito(doc))
                return favs
            }
            else
            {
                return null
            }
        } catch (error) {
            throw error
        }
    }
    
}
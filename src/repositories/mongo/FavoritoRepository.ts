import { IFavoritoRepository } from "../protocols/IFavoritoRepository"
import { mongo } from "../../data/mongoDB/conn"
import { ObjectId } from "mongodb"
import { Favorito } from "../../models/Favorito"
import { toFavorito } from "../../utils/ToFavorito"

export class FavoritoRepository implements IFavoritoRepository
{
    async save(fav : Favorito): Promise<Favorito>
    {
        try {
            const FavoritoCollection = mongo.db.collection('Favorito')
            await FavoritoCollection.deleteMany({_id : null as unknown as ObjectId, idUser : null})

            const doc = await FavoritoCollection.insertOne({
                _id : fav.id as unknown as ObjectId,
                idUser : fav.idUser,
                idMed : fav.idMed,
                numRegistro : fav.numRegistro
            })

            return {
                id : doc.insertedId as unknown as string,
                idUser : fav.idUser,
                idMed : fav.idMed,
                numRegistro : fav.numRegistro
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
            const docs = await FavoritoCollection.find({idUser : id as unknown as ObjectId}).toArray()
    
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
    async delete(id: string): Promise<void> {
        try {
            const FavoritoCollection = mongo.db.collection('Favorito')
            await FavoritoCollection.deleteOne({_id : id as unknown as ObjectId})
        } catch (error) {
            throw error
        }
    }
    async findById(Id: string): Promise<Favorito | null> {
        try {
            const FavoritoCollection = mongo.db.collection('Favorito')
            const doc = await FavoritoCollection.findOne({ _id : Id as unknown as ObjectId})
            if(doc != null)
            {
                const fav = toFavorito(doc)
                return fav
            }
            else
            {
                return null
            }
        } catch (error) {
            throw error
        }
    }
    async getAll(): Promise<Favorito[]> {
        try
        {
            const FavoritoCollection = mongo.db.collection('Favorito')
            const docs = await FavoritoCollection.find().toArray()
            const favs = docs.map(doc => toFavorito(doc))
            return favs
        }
        catch (err)
        {
            throw err
        }
    }
    async deleteByIdUser(IdUser: string): Promise<void> {
        try {
            const FavoritoCollection = mongo.db.collection('Favorito')
            await FavoritoCollection.deleteMany({ idUser : IdUser})
        } catch (error) {
            throw error
        }
    }
    async findByUser_Medic(idUser: string, idMed: string): Promise<Favorito | null> {
        try {
            const FavoritoCollection = mongo.db.collection('Favorito')
            const doc = await FavoritoCollection.findOne({ idUser : idUser, idMed : idMed})
            if(doc != null)
            {
                const fav = toFavorito(doc)
                return fav
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
import { Favorito } from "../models/Favorito"

export function toFavorito(obj : any): Favorito {
    return {
        id : obj._id,
        idUser : obj.idUser,
        idMed : obj.idMed,
        numProcesso : obj.numProcesso
    }
}
import { Favorito } from "../models/Favorito"

export function toFavorito(obj : any): Favorito {
    //console.log("Obj: ", obj)
    const result = {
        id : obj._id,
        idUser : obj.idUser,
        idMed : obj.idMed,
        numRegistro : obj.numRegistro
    }
    //console.log(result)
    return result
}
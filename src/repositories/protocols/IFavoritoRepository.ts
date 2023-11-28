import { Favorito } from "../../models/Favorito";

export interface IFavoritoRepository {
    save(fav : Favorito): Promise<Favorito>;
    findById( Id : string) : Promise<Favorito | null>;
    findByIdUser(id : string): Promise<Favorito[] | null>;
    findByUser_Medic(idUser : string, idMed : string): Promise<Favorito | null>;
    //findOneByIdUser(id : string) : Promise <Favorito | null>;
    delete( id : string) : Promise<void>;
    deleteByIdUser(IdUser : string) : Promise<void>;
    getAll() : Promise<Favorito[]>;
}
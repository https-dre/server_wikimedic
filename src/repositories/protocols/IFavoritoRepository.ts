import { Favorito } from "../../models/Favorito";

export interface IFavoritoRepository {
    postFav(fav : Favorito): Promise<Favorito>;
    findById( Id : string) : Promise<Favorito | null>;
    findByIdUser(id : string): Promise<Favorito[] | null>;
    //findOneByIdUser(id : string) : Promise <Favorito | null>;
    delete( id : string) : Promise<void>;
}
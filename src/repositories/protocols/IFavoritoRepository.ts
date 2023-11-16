export interface IFavoritoRepository {
    postFav(fav : Favorito): Promise<Favorito>;
    findByIdUser(id : string): Promise<Favorito[] | null>;
    //findOneByIdUser(id : string) : Promise <Favorito | null>;
}
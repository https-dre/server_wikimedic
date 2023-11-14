export interface IFavRepository {
    postFav(fav : Favorito): Promise<Favorito>;
    findByIdUser(id : string): Promise<Favorito[] | false>;
}
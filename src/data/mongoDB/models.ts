import mongoose from "mongoose"

import { UserSchema, MedicamentoSchema, FavoritoSchema} from "./schemas"

export const UserModel = mongoose.model("User", UserSchema)

export const MedicamentoModel = mongoose.model("Medicamento", MedicamentoSchema)

export const FavoritoModel = mongoose.model("Favorito", FavoritoSchema)
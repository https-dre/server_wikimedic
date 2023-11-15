import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    email_reserva: String,
    password: String
});

export const MedicamentoSchema = new mongoose.Schema({
    id : String,
    name : String,
    numProcesso : String
})

export const FavoritoSchema = new mongoose.Schema({
    id : String,
    idUser : String,
    idMed: String,
    numProcesso : String
})


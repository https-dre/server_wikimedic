import { Medicamento } from "../models/Medicamento"

export function toMedic(obj : any) : Medicamento {
    return {
        id : obj._id,
        name : obj.name,
        numProcesso : obj.numProcesso
    }
}

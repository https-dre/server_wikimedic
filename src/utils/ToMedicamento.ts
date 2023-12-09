import { Medicamento } from "../models/Medicamento"

export function toMedic(obj : any) : Medicamento {
    return {
        id : obj._id,
        name : obj.name,
        numRegistro : obj.numRegistro,
        categoria : obj.categoria,
        indicacao : obj.indicacao,
        contraindicacao : obj.contraindicacao,
        cuidados: obj.cuidados,
        reacao_adversa : obj.reacao_adversa,
        posologia : obj.posologia,
        riscos : obj.riscos,
        especiais : obj.especiais
    }
}

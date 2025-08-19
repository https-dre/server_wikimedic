import { Medicamento } from "../models/Medicamento";

export function toMedic(obj: any): Medicamento {
  const { _id, ...rest } = obj;
  return {
    ...rest,
    id: _id.toString(),
  };
}

import { Medicamento } from "../models/Medicamento";

//eslint-disable-next-line
export function toMedic(obj: any): Medicamento {
  const { _id, ...rest } = obj;
  return {
    ...rest,
    id: _id.toString(),
  };
}

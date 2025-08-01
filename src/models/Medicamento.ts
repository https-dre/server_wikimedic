import z from "zod";

export const zMedicine = z.object({
  id: z.string(),
  name: z.string(),
  numRegistro: z.string(),
  categoria: z.string(),
  indicacao: z.string(),
  contraindicacao: z.string(),
  reacao_adversa: z.string(),
  cuidados: z.string(),
  posologia: z.string(),
  riscos: z.string(),
  especiais: z.string(),
  superdose: z.string(),
});

export type Medicamento = z.infer<typeof zMedicine>;
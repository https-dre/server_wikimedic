import { z } from "zod";
import { zMedicine } from "../../models/Medicamento";

export const search = {
  schema: {
    summary: "Search medicine by name",
    params: z.object({
      name: z.string(),
    }),
    response: {
      200: z.object({
        data: z.array(zMedicine),
        dataLength: z.number(),
      }),
    },
  },
};

export const getById = {
  schema: {
    summary: "Get medicine by id",
    params: z.object({
      id: z.string().uuid(),
    }),
    response: {
      200: z.object({
        data: zMedicine,
      }),
    },
  },
};

export const filterByScope = {
  schema: {
    summary: "Filter medicine by field and value",
    params: z.object({
      field: z.string(),
      value: z.string(),
    }),
    query: z.object({
      page: z.coerce.number().default(0),
      limit: z.coerce.number().default(10),
    }),
    response: {
      200: z.object({
        data: z.array(zMedicine),
        dataLength: z.number(),
      }),
    },
  },
};

export const postMedicine = {
  schema: {
    summary: "Create medicine",
    body: z.object({
      med: zMedicine.omit({ id: true }),
    }),
    response: {
      201: z.object({
        id: z.string().uuid(),
      }),
    },
  },
};

export const deleteMedicine = {
  schema: {
    summary: "Delete medicine by id",
    params: z.object({
      id: z.string().uuid(),
    }),
    response: {
      204: z.null(),
    },
  },
};

export const distinctMedicine = {
  schema: {
    summary: "Get distinct values",
    params: z.object({
      scope: z.string(),
    }),
  },
};

export const zMedicineOptional = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  numRegistro: z.string().optional(),
  categoria: z.string().optional(),
  indicacao: z.string().optional(),
  contraindicacao: z.string().optional(),
  reacao_adversa: z.string().optional(),
  cuidados: z.string().optional(),
  posologia: z.string().optional(),
  riscos: z.string().optional(),
  especiais: z.string().optional(),
  superdose: z.string().optional(),
});

export const updateMedicine = {
  schema: {
    summary: "Update medicine",
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      update: zMedicineOptional.omit({ id: true }).partial(),
    }),
    response: {
      204: z.null(),
    },
  },
};

export const uploadMedicineImage = {
  schema: {
    summary: "Upload image",
    description: "Send multipart/form-data",
    params: z.object({
      med_id: z.string().uuid()
    }),
  }
}
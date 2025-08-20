import { z } from "zod";
import { zUser } from "../../models/User";

export const createUserAccount = {
  summary: "Create user",
  tags: ["user"],
  body: z.object({
    data: zUser.omit({ id: true }),
  }),
};

export const userLogin = {
  summary: "Auth user",
  tags: ["user"],
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
};

export const updateUserProfile = {
  summary: "Update profile",
  tags: ["user"],
  body: z.object({
    updatedFields: zUser.omit({ id: true }).partial(),
  }),
};

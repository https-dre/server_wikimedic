import { z } from "zod";

export const zUser = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  password: z.string()
})

export type User = z.infer<typeof zUser>;
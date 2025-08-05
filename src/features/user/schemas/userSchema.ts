import { z } from "zod"

export const roles = ["ADMIN", "PROFESSIONAL"] as const
export type UserRole = (typeof roles)[number] // ← ahora está definido localmente

export const createUserSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(roles),
  avatar: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>

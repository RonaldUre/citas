import { z } from "zod"

export const createServiceSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),

  description: z
    .string()
    .max(300, "Máximo 300 caracteres")
    .optional()
    .or(z.literal("")),

  duration: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .min(1, "Debe durar al menos 1 minuto")
      .refine((val) => !isNaN(val), "Debe ser un número válido")
  ),

  price: z
    .preprocess(
      (val) => (val === "" ? undefined : typeof val === "string" ? Number(val) : val),
      z
        .number()
        .nonnegative("El precio no puede ser negativo")
        .optional()
        .refine((val) => val === undefined || !isNaN(val), "Debe ser un número válido")
    ),
})

// Este ahora sí funciona bien
export const updateServiceSchema = createServiceSchema.partial()

// Tipos inferidos a partir del schema
export type CreateServiceFormValues = z.infer<typeof createServiceSchema>
export type UpdateServiceFormValues = z.infer<typeof updateServiceSchema>

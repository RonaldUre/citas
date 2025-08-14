// features/report/schemas/reportSchema.ts
import { z } from "zod"

export const createReportSchema = z.object({
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(1000, "Máximo 1000 caracteres"),

  // Los Switch ya entregan boolean
  isForEventCancel: z.boolean(),
  hasRecovery: z.boolean(),

  // Lo pasas como number desde el modal
  appointmentId: z.number().int().min(1, "appointmentId inválido"),
})

export const updateReportSchema = createReportSchema.partial()

export type CreateReportFormValues = z.infer<typeof createReportSchema>
export type UpdateReportFormValues = z.infer<typeof updateReportSchema>


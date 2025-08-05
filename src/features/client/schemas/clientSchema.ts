import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
})

export type ClientFormInput = z.infer<typeof clientSchema>
import { z } from "zod"

export const recetaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").trim(),
  ingredientes: z
    .array(z.string().min(1).trim())
    .min(1, "Debe tener al menos un ingrediente"),
  tiempoMinutos: z
    .number()
    .int()
    .positive("El tiempo debe ser un número positivo"),
})

export const recetaPartialSchema = recetaSchema.partial()

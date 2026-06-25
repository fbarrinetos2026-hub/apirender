import * as recetaService from "../services/recetas.js"
import { recetaSchema, recetaPartialSchema } from "../validators/recetas.js"

export function getRecetas(req, res) {
  const recetas = recetaService.findAll()
  res.json(recetas)
}

export function getRecetaById(req, res) {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" })
  }

  const receta = recetaService.findById(id)
  if (!receta) {
    return res.status(404).json({ error: "Receta no encontrada" })
  }

  res.json(receta)
}

export function createReceta(req, res) {
  const result = recetaSchema.safeParse(req.body)

  if (!result.success) {
    const errores = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    )
    return res.status(400).json({ error: "Datos inválidos", detalles: errores })
  }

  const receta = recetaService.create(result.data)
  res.status(201).json({
    mensaje: "Receta agregada correctamente",
    receta,
  })
}

export function updateReceta(req, res) {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" })
  }

  const result = recetaPartialSchema.safeParse(req.body)

  if (!result.success) {
    const errores = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    )
    return res.status(400).json({ error: "Datos inválidos", detalles: errores })
  }

  if (Object.keys(result.data).length === 0) {
    return res.status(400).json({ error: "No hay datos para actualizar" })
  }

  const receta = recetaService.update(id, result.data)
  if (!receta) {
    return res.status(404).json({ error: "Receta no encontrada" })
  }

  res.json({
    mensaje: "Receta actualizada correctamente",
    receta,
  })
}

export function deleteReceta(req, res) {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" })
  }

  const eliminada = recetaService.remove(id)
  if (!eliminada) {
    return res.status(404).json({ error: "Receta no encontrada" })
  }

  res.json({ mensaje: "Receta eliminada correctamente" })
}

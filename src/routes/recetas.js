import { Router } from "express"
import {
  getRecetas,
  getRecetaById,
  createReceta,
  updateReceta,
  deleteReceta,
} from "../controllers/recetas.js"

const router = Router()

/**
 * @openapi
 * /recetas:
 *   get:
 *     summary: Lista todas las recetas
 *     tags: [Recetas]
 *     responses:
 *       200:
 *         description: Lista de recetas
 *   post:
 *     summary: Crea una nueva receta
 *     tags: [Recetas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, ingredientes, tiempoMinutos]
 *             properties:
 *               nombre:
 *                 type: string
 *               ingredientes:
 *                 type: array
 *                 items:
 *                   type: string
 *               tiempoMinutos:
 *                 type: number
 *     responses:
 *       201:
 *         description: Receta creada
 *       400:
 *         description: Datos inválidos
 */
router.get("/", getRecetas)
router.post("/", createReceta)

/**
 * @openapi
 * /recetas/{id}:
 *   get:
 *     summary: Obtiene una receta por ID
 *     tags: [Recetas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Receta encontrada
 *       404:
 *         description: Receta no encontrada
 *   put:
 *     summary: Actualiza una receta
 *     tags: [Recetas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               ingredientes:
 *                 type: array
 *                 items:
 *                   type: string
 *               tiempoMinutos:
 *                 type: number
 *     responses:
 *       200:
 *         description: Receta actualizada
 *       404:
 *         description: Receta no encontrada
 *   delete:
 *     summary: Elimina una receta
 *     tags: [Recetas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Receta eliminada
 *       404:
 *         description: Receta no encontrada
 */
router.get("/:id", getRecetaById)
router.put("/:id", updateReceta)
router.delete("/:id", deleteReceta)

export default router

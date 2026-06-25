import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

const recetas = [
  {
    id: 1,
    nombre: "Tacos al pastor",
    ingredientes: ["tortilla", "cerdo", "piña", "cebolla", "cilantro"],
    tiempoMinutos: 30,
  },
  {
    id: 2,
    nombre: "Ensalada de quinoa",
    ingredientes: ["quinoa", "tomate", "aguacate", "pepino", "limón"],
    tiempoMinutos: 20,
  },
  {
    id: 3,
    nombre: "Pasta con pesto",
    ingredientes: ["pasta", "albahaca", "piñones", "parmesano", "ajo"],
    tiempoMinutos: 25,
  },
]

app.get("/recetas", (req, res) => {
  res.json(recetas)
})

app.get("/recetas/:id", (req, res) => {
  const id = Number(req.params.id)
  const receta = recetas.find((item) => item.id === id)

  if (!receta) {
    return res.status(404).json({ error: "Receta no encontrada" })
  }

  res.json(receta)
})

app.post("/recetas", (req, res) => {
  const { nombre, ingredientes, tiempoMinutos } = req.body

  if (!nombre || !Array.isArray(ingredientes) || typeof tiempoMinutos !== "number") {
    return res.status(400).json({ error: "Datos de receta inválidos" })
  }

  const nuevaReceta = {
    id: recetas.length + 1,
    nombre,
    ingredientes,
    tiempoMinutos,
  }

  recetas.push(nuevaReceta)

  res.status(201).json({
    mensaje: "Receta agregada correctamente",
    totalRecetas: recetas.length,
    receta: nuevaReceta,
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API de recetas activa en http://localhost:${PORT}`)
})
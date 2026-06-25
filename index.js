import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "JSON inválido" })
  }
  next(err)
})

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

app.get("/", (req, res) => {
  res.json({
    mensaje: "API de recetas activa",
    rutas: ["/recetas", "/recetas/:id"],
  })
})

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
  const { nombre, ingredientes, tiempoMinutos } = req.body || {}

  if (
    typeof nombre !== "string" ||
    nombre.trim() === "" ||
    !Array.isArray(ingredientes) ||
    ingredientes.some((item) => typeof item !== "string" || item.trim() === "") ||
    typeof tiempoMinutos !== "number" ||
    Number.isNaN(tiempoMinutos) ||
    tiempoMinutos <= 0
  ) {
    return res.status(400).json({ error: "Datos de receta inválidos" })
  }

  const nuevaReceta = {
    id: recetas.length + 1,
    nombre: nombre.trim(),
    ingredientes: ingredientes.map((item) => item.trim()),
    tiempoMinutos,
  }

  recetas.push(nuevaReceta)

  res.status(201).json({
    mensaje: "Receta agregada correctamente",
    totalRecetas: recetas.length,
    receta: nuevaReceta,
  })
})

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API de recetas activa en http://localhost:${PORT}`)
})
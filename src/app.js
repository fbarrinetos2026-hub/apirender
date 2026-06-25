import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swagger.js"
import recetasRouter from "./routes/recetas.js"
import { errorHandler } from "./middlewares/errorHandler.js"

const app = express()

app.use(helmet())
app.use(cors())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Demasiadas solicitudes, intente más tarde" },
})
app.use(limiter)

app.use(morgan("dev"))
app.use(express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/", (_req, res) => {
  res.json({
    mensaje: "API de recetas activa",
    docs: "/api-docs",
    rutas: ["/recetas", "/recetas/:id"],
  })
})

app.use("/recetas", recetasRouter)

app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" })
})

app.use(errorHandler)

export default app

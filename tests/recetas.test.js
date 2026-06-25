import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { mkdirSync, existsSync, unlinkSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const testDbPath = join(__dirname, "../data/test-recetas.db")

process.env.NODE_ENV = "test"

let app
let server
const BASE = "http://localhost:3001"

beforeAll(async () => {
  if (existsSync(testDbPath)) unlinkSync(testDbPath)

  process.env.DB_PATH = testDbPath

  const mod = await import("../src/app.js")
  app = mod.default

  await new Promise((resolve) => {
    server = app.listen(3001, resolve)
  })
})

afterAll(() => {
  server?.close()
  if (existsSync(testDbPath)) unlinkSync(testDbPath)
})

describe("API de Recetas", () => {
  let recetaId

  it("GET / - debería devolver mensaje de bienvenida", async () => {
    const res = await fetch(`${BASE}/`)
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.mensaje).toBe("API de recetas activa")
  })

  it("GET /recetas - debería listar recetas", async () => {
    const res = await fetch(`${BASE}/recetas`)
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(3)
  })

  it("GET /recetas/1 - debería devolver una receta", async () => {
    const res = await fetch(`${BASE}/recetas/1`)
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.nombre).toBe("Tacos al pastor")
  })

  it("GET /recetas/999 - debería devolver 404", async () => {
    const res = await fetch(`${BASE}/recetas/999`)
    expect(res.status).toBe(404)
  })

  it("POST /recetas - debería crear una receta", async () => {
    const res = await fetch(`${BASE}/recetas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: "Tortilla de patatas",
        ingredientes: ["huevos", "patatas", "cebolla", "aceite"],
        tiempoMinutos: 35,
      }),
    })
    const data = await res.json()
    expect(res.status).toBe(201)
    expect(data.receta.nombre).toBe("Tortilla de patatas")
    recetaId = data.receta.id
  })

  it("POST /recetas - debería rechazar datos inválidos", async () => {
    const res = await fetch(`${BASE}/recetas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: "" }),
    })
    expect(res.status).toBe(400)
  })

  it(`PUT /recetas/${() => recetaId} - debería actualizar una receta`, async () => {
    const res = await fetch(`${BASE}/recetas/${recetaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tiempoMinutos: 40 }),
    })
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.receta.tiempoMinutos).toBe(40)
  })

  it(`DELETE /recetas/${() => recetaId} - debería eliminar una receta`, async () => {
    const res = await fetch(`${BASE}/recetas/${recetaId}`, {
      method: "DELETE",
    })
    expect(res.status).toBe(200)

    const res2 = await fetch(`${BASE}/recetas/${recetaId}`)
    expect(res2.status).toBe(404)
  })
})

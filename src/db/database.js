import Database from "better-sqlite3"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, "../../data/recetas.db")

let db

export function getDb() {
  if (!db) {
    db = new Database(dbPath)
    db.pragma("journal_mode = WAL")
    db.pragma("foreign_keys = ON")
    init()
  }
  return db
}

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS recetas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      ingredientes TEXT NOT NULL,
      tiempoMinutos INTEGER NOT NULL,
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `)

  const count = db.prepare("SELECT COUNT(*) as total FROM recetas").get()
  if (count.total === 0) {
    const insert = db.prepare(
      "INSERT INTO recetas (nombre, ingredientes, tiempoMinutos) VALUES (?, ?, ?)"
    )

    insert.run("Tacos al pastor", JSON.stringify(["tortilla", "cerdo", "piña", "cebolla", "cilantro"]), 30)
    insert.run("Ensalada de quinoa", JSON.stringify(["quinoa", "tomate", "aguacate", "pepino", "limón"]), 20)
    insert.run("Pasta con pesto", JSON.stringify(["pasta", "albahaca", "piñones", "parmesano", "ajo"]), 25)
  }
}

import { getDb } from "../db/database.js"

export function findAll() {
  const db = getDb()
  const rows = db.prepare("SELECT * FROM recetas ORDER BY id ASC").all()
  return rows.map(formatReceta)
}

export function findById(id) {
  const db = getDb()
  const row = db.prepare("SELECT * FROM recetas WHERE id = ?").get(id)
  return row ? formatReceta(row) : null
}

export function create(data) {
  const db = getDb()
  const { nombre, ingredientes, tiempoMinutos } = data
  const result = db
    .prepare("INSERT INTO recetas (nombre, ingredientes, tiempoMinutos) VALUES (?, ?, ?)")
    .run(nombre, JSON.stringify(ingredientes), tiempoMinutos)
  return findById(result.lastInsertRowid)
}

export function update(id, data) {
  const db = getDb()
  const existing = db.prepare("SELECT * FROM recetas WHERE id = ?").get(id)
  if (!existing) return null

  const nombre = data.nombre ?? existing.nombre
  const ingredientes = data.ingredientes
    ? JSON.stringify(data.ingredientes)
    : existing.ingredientes
  const tiempoMinutos = data.tiempoMinutos ?? existing.tiempoMinutos

  db.prepare(
    "UPDATE recetas SET nombre = ?, ingredientes = ?, tiempoMinutos = ? WHERE id = ?"
  ).run(nombre, ingredientes, tiempoMinutos, id)

  return findById(id)
}

export function remove(id) {
  const db = getDb()
  const existing = db.prepare("SELECT * FROM recetas WHERE id = ?").get(id)
  if (!existing) return false
  db.prepare("DELETE FROM recetas WHERE id = ?").run(id)
  return true
}

function formatReceta(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    ingredientes: JSON.parse(row.ingredientes),
    tiempoMinutos: row.tiempoMinutos,
    createdAt: row.createdAt,
  }
}

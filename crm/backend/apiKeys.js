import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Pool } from "pg";

const app = express();
const PORT = 3000;

// Konfiguracja połączenia z bazą danych PostgreSQL
const pool = require('../db/config');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CRUD dla tabeli `api_keys`

// 1. Pobierz wszystkie klucze API
app.get("/api/keys", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM api_keys ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd podczas pobierania kluczy API:", error.message);
    res.status(500).json({ error: "Błąd serwera podczas pobierania danych." });
  }
});

// 2. Pobierz klucz API dla określonego użytkownika
app.get("/api/keys/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM api_keys WHERE user_id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nie znaleziono kluczy dla tego użytkownika." });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd podczas pobierania klucza API:", error.message);
    res.status(500).json({ error: "Błąd serwera podczas pobierania danych." });
  }
});

// 3. Dodaj nowy klucz API
app.post("/api/keys", async (req, res) => {
  const { user_id, openai_key } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO api_keys (user_id, openai_key) VALUES ($1, $2) RETURNING *",
      [user_id, openai_key]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Błąd podczas dodawania klucza API:", error.message);
    res.status(500).json({ error: "Błąd serwera podczas dodawania klucza." });
  }
});

// 4. Zaktualizuj klucz API
app.put("/api/keys/:id", async (req, res) => {
  const { id } = req.params;
  const { openai_key, is_active } = req.body;
  try {
    const result = await pool.query(
      "UPDATE api_keys SET openai_key = $1, is_active = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [openai_key, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nie znaleziono klucza API do zaktualizowania." });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Błąd podczas aktualizacji klucza API:", error.message);
    res.status(500).json({ error: "Błąd serwera podczas aktualizacji klucza." });
  }
});

// 5. Usuń klucz API
app.delete("/api/keys/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM api_keys WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nie znaleziono klucza API do usunięcia." });
    }
    res.status(200).json({ message: "Klucz API został usunięty.", deletedKey: result.rows[0] });
  } catch (error) {
    console.error("Błąd podczas usuwania klucza API:", error.message);
    res.status(500).json({ error: "Błąd serwera podczas usuwania klucza." });
  }
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});

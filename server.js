const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");

// Use environment variables or fallback defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST || "sql.freedb.tech",
  user: process.env.DB_USER || "u_pV9axE",
  password: process.env.DB_PASSWORD || "SPzTvXkx0cA9",
  database: process.env.DB_NAME || "freedb_6GM1mEc9",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Get all books
app.get("/api/books", (req, res) => {
  pool.query("SELECT * FROM booktitle", (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ msg: "Error fetching data" });
    }
    res.json(rows);
  });
});

// Add a new book
app.post("/api/books", (req, res) => {
  const { books, author, yearpub } = req.body;
  pool.query(
    "INSERT INTO books (booktitle, author, year) VALUES (?, ?, ?)",
    [books, author, yearpub],
    (err) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ msg: "Error inserting data" });
      }
      res.json({ msg: "Successfully inserted!" });
    }
  );
});

// Search by ID (uncomment if needed)
/*
app.get("/api/booktitle/:id", (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM booktitle WHERE id = ?", [id], (err, rows) => {
    if (err) {
      console.error("Error fetching by ID:", err);
      return res.status(500).json({ msg: "Error fetching data" });
    }
    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ msg: `${id} not found` });
    }
  });
});
*/

// Update a book (uncomment if needed)
/*
app.put("/api/booktitle", (req, res) => {
  const { id, book, author, yearpub } = req.body;
  pool.query(
    "UPDATE booktitle SET booktitle = ?, Author = ?, Year_Published = ? WHERE id = ?",
    [book, author, yearpub, id],
    (err) => {
      if (err) {
        console.error("Error updating data:", err);
        return res.status(500).json({ msg: "Error updating data" });
      }
      res.json({ msg: "Successfully updated" });
    }
  );
});
*/

// Delete a book (uncomment if needed)
/*
app.delete("/api/booktitle", (req, res) => {
  const { id } = req.body;
  pool.query("DELETE FROM booktitle WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ msg: "Error deleting data" });
    }
    res.json({ msg: "Successfully deleted" });
  });
});
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

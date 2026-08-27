const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");

// Use environment variables or fallback defaults
const pool = mysql.createPool({
  host: "sql.freedb.tech",
  user: "u_pV9axE",
  password: "SPzTvXkx0cA9",
  database: "freedb_6GM1mEc9",
  connectionLimit: 10,
  waitForConnection: true,
  queuLimit: 0,
});

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Get all book titles
app.get("/api/booktitle", (req, res) => {
  pool.query("SELECT * FROM books", (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ msg: "Error fetching data" });
    }
    res.json(rows);
  });
});

// Add a new book title
app.post("/api/booktitle", (req, res) => {
  const { booktitle, author, year } = req.body; // match schema
  pool.query(
    "INSERT INTO books (booktitle, author, year) VALUES (?, ?, ?)",
    [booktitle, author, year],
    (err) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ msg: "Error inserting data" });
      }
      res.json({ msg: "Successfully inserted!" });
    }
  );
});

// Search by ID
app.get("/api/booktitle/:id", (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM books WHERE id = ?", [id], (err, rows) => {
    if (err) {
      console.error("Error fetching by ID:", err);
      return res.status(500).json({ msg: "Error fetching data" });
    }
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ msg: `${id} not found` });
    }
  });
});

// Update a book title
app.put("/api/booktitle", (req, res) => {
  const { id, booktitle, author, year } = req.body;
  pool.query(
    "UPDATE booktitle SET booktitle = ?, author = ?, year = ? WHERE id = ?",
    [booktitle, author, year, id],
    (err) => {
      if (err) {
        console.error("Error updating data:", err);
        return res.status(500).json({ msg: "Error updating data" });
      }
      res.json({ msg: "Successfully updated" });
    }
  );
});

// Delete a book title
app.delete("/api/booktitle", (req, res) => {
  const { id } = req.body;
  pool.query("DELETE FROM books WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ msg: "Error deleting data" });
    }
    res.json({ msg: "Successfully deleted" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

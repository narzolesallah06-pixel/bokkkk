const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const pool = mysql.createPool({
  host: "sql.freedb.tech",
  user: "u_pV9axE",
  password: "SPzTvXkx0cA9",
  database: "freedb_6GM1mEc9",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});
//HEALTH
app.get("/", (req, res) => {
  pool.query("SELECT 1", (err) => {
    if (err) return res.status(503).json({ msg: "Database is unreachable" });
    res.json({ status: "ok" });
  });
});
//REPORT
app.get("/api/booktitle", (req, res) => {
  pool.query(
    "SELECT id, title, author, year_published FROM books ORDER BY id DESC",
    (err, rows, fields) => {
      if (err) return res.status(500).json({ msg: err.sqlMessage || err.message });
      res.json(rows);
    },
  );
});
//CREATE
app.post("/api/books", (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const year = Number(req.body.year_published);
  if (!title || !author || !req.body.year_published) {
    return res.status(400).json({ msg: "title, author and year_published are required" });
  }
  if (!Number.isInteger(year) || year < 1000 || year > 2100) {
    return res.status(400).json({ msg: "year_published must be a year between 1000 and 2100" });
  }
  pool.query(
    "INSERT INTO books (booktitle, author, year) VALUES (?, ?, ?)",
    [title, author, year],
    (err, rows, fields) => {
      if (err) return res.status(500).json({ msg: err.sqlMessage || err.message });
      res.json({ msg: `Successfully inserted!`, id: rows.insertId });
    },
  );
});
//SEARCH
app.get("/api/books/:id", (req, res) => {
  const id = req.params.id;
  pool.query(
    "SELECT id, title, author, year_published FROM books WHERE id = ?",
    [id],
    (err, rows, fields) => {
      if (err) return res.status(500).json({ msg: err.sqlMessage || err.message });
      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(404).json({ msg: `${id} id not found!` });
      }
    },
  );
});
//UPDATE
const updateBook = (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const year = Number(req.body.year_published);
  const id = req.params.id || req.body.id;
  if (!id) return res.status(400).json({ msg: "id is required" });
  if (!title || !author || !req.body.year_published) {
    return res.status(400).json({ msg: "title, author and year_published are required" });
  }
  if (!Number.isInteger(year) || year < 1000 || year > 2100) {
    return res.status(400).json({ msg: "year_published must be a year between 1000 and 2100" });
  }
  pool.query(
    "UPDATE books SET title = ?, author = ?, year_published = ? WHERE id = ?",
    [title, author, year, id],
    (err, rows, fields) => {
      if (err) return res.status(500).json({ msg: err.sqlMessage || err.message });
      if (rows.affectedRows === 0) {
        return res.status(404).json({ msg: `${id} id not found!` });
      }
      res.json({ msg: `Successfully updated` });
    },
  );
};
app.put("/api/books", updateBook);
app.put("/api/books/:id", updateBook);
//DELETE
const deleteBook = (req, res) => {
  const id = req.params.id || req.body.id;
  if (!id) return res.status(400).json({ msg: "id is required" });
  pool.query("DELETE FROM books WHERE id = ?", [id], (err, rows, fields) => {
    if (err) return res.status(500).json({ msg: err.sqlMessage || err.message });
    if (rows.affectedRows === 0) {
      return res.status(404).json({ msg: `${id} id not found!` });
    }
    res.json({ msg: `Successfully deleted` });
  });
};
app.delete("/api/books", deleteBook);
app.delete("/api/books/:id", deleteBook);

app.use((req, res) => {
  res.status(404).json({ msg: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});

module.exports = app;

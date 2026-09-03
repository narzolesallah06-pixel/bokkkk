const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const pool = mysql.createPool({
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "employee",

  host: "sql.freedb.tech",
  user: "u_pV9axE",
  password: "SPzTvXkx0cA9",
  database: "freedb_6GM1mEc9",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});
//REPORT
app.get("/api/books", (req, res) => {
  pool.query("SELECT * FROM books", (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});
//CREATE
app.post("/api/books", (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const year = req.body.year;
  pool.query(
    "INSERT INTO books (booktitle, author, year) VALUES (?, ?, ?)",
    [title, author, year],
    (err, rows, fields) => {
      if (err) throw err;
      res.json({ msg: `Successfully inserted!` });
    },
  );
});
//SEARCH
app.get("/api/books/:id", (req, res) => {
  const id = req.params.id;
  pool.query(
    "SELECT * FROM books WHERE id = ?", [id], (err, rows, fields) => {
      if (err) throw err;
      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(400).json({ msg: `${id} id not found!` });
      }
    },
  );
});
//UPDATE
app.put("/api/books", (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const year = req.body.year;
  const id = req.body.id;

  pool.query(
    "UPDATE books SET booktitle = ?, author = ?, year = ? WHERE id = ?",
    [title, author, year, id],
    (err, rows, fields) => {
      if (err) throw err;
      res.json({ msg: `Successfully updated` });
    },
  );
});
//DELETE
app.delete("/api/books", (req, res) => {
  const id = req.body.id;
  pool.query("DELETE FROM books WHERE id = ?", [id], (err, rows, fields) => {
    if (err) throw err;
    res.json({ msg: `Successfully deleted` });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
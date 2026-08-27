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
// database: "booktitle",
  //host: "sql.freedb.tech",
 // user: "u_xJwwzY",
 // password: "SCiwDeDLjWNC",
 // database: "freedb_Hbqyt1g3",

   host: "sql.freedb.tech",
  user: "u_pV9axE",
 password: "SPzTvXkx0cA9",
 database: "freedb_6GM1mEc9",

  connectionLimit: 10,
  waitForConnections: true,

  queueLimit: 0,

});



//REPORT

app.get("/api/booktitle", (req, res) => {

  pool.query("SELECT * FROM userdata", (err, rows, fields) => {

    if (err) throw err;

    res.json(rows);

  });

});



//CREATE

app.post("/api/booktitle", (req, res) => {

  const booktitle = req.body.booktitle;

  const lname = req.body.lname;

  const email = req.body.email;

 
  pool.query(

    "INSERT INTO userdata (booktitle,Author,Year_Published) VALUES (?, ?, ?, ?)",

    [book,author, yearpub],

    (err, rows, fields) => {

      if (err) throw err;

      res.json({ msg: `Successfully inserted!` });

    },

  );

});



//SEARCH

app.get("/api/booktitle/:id", (req, res) => {

  const id = req.params.id;

  pool.query(

    "SELECT * FROM userdata WHERE id = ?", [id], (err, rows, fields) => {

      if (err) throw err;

      if (rows.length > 0) {

        res.json(rows);

      } 

      else {

        res.status(400).json({ msg: `${id} id not found!` });

      }

    },

  );

});



//UPDATE

app.put("/api/booktitle", (req, res) => {

  const book = req.body.book;

  const author = req.body.author;

  const yearpub = req.body.yearpub;


  const id = req.body.id;



  pool.query(

    "UPDATE userdata SET bookstitle = ?, Author = ?, Year_Published = ? WHERE id = ?",

    [book, author, yearpub,  id],

    (err, rows, fields) => {

      if (err) throw err;

      res.json({ msg: `Successfully updated` });

    },

  );

});



//DELETE

app.delete("/api/booktitle", (req, res) => {

  const id = req.body.id;

  pool.query("DELETE FROM userdata WHERE id = ?", [id], (err, rows, fields) => {

    if (err) throw err;

    res.json({ msg: `Successfully deleted` });

  });

});



app.listen(PORT, () => {

  console.log(`Server is running in port ${PORT}`);

});
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParse = require('body-parser');
const compression = require('compression');

const app = express();

const PORT = 3004;

//const boring = require("../mysql-boring.js");

app.use(compression());
app.use("/:id", cors(), express.static(__dirname + "/../client/public"));



app.use(bodyParse.json());

const connection = mysql.createConnection({
  host: "database",
  port: "3306",
  password: "----",
  user: "root",
  database: "bookings"    
});

connection.connect((err) => {
    if (err) {
        console.log("error with express server connectioning to db", err);
    }
    console.log("Connected to MySQL DB");
});

app.get("/getrentaldata/:id", cors(), 
  (req, res) => {
    // this routes the request which comes from the
    // getDataForId function in index.jsx and then passes
    // the id along to query the database and return the entire
    // data body to the client

    connection.query(
      `SELECT * FROM rental_price_info WHERE id=${req.params.id}`,
    )
    .then((results) => {
      res.send(results);
    })
    .catch(
      (e) => { 
        console.log(`error with getting all fields by id from rental_price_info between server and db`, e)
      }
    )

  }
)



app.get("/getavailabilitydata/:id", cors(),
  (req, res) => {
    connection.query(
      `SELECT * FROM rental_availability WHERE rental_id=${req.params.id}`
    )
    .then((results)=>{
      res.send(results);
    })
    .catch((e)=>{
      console.log('error on server getting rental availability from database ', e)
    })
  }
);


app.listen(PORT, ()=>{console.log(`Listening on ${PORT}`)});
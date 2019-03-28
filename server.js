// require needed modules/dependencies
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const credentials = require('./config/db');

// instantiate express application and mySQL database connection
const app = express();
const PORT = process.env.PORT || 3001;
const connection = mysql.createConnection(credentials);

// verify if connection is successful
connection.connect((err) => {
  if (err) {
    console.log("Error connecting to db");
    return;
  }
  console.log('connected to db');
});

// consumption of middleware
// used to parse data out of the request body

// allows us to parse a request sending a content-type of application/json
app.use(bodyParser.json());
// uses application/x-www-urlencoded for AJAX, axios uses json
app.use(bodyParser.urlencoded({ extended: false }));

// routes
// app.get('/', (req, res) => {
//   res.send('Luigi');
//   console.log('this is a response: ', res);
// });

// generate endpoints or routes
app.get("/", (req, res) => {
  // not using path module
  // res.sendFile(__dirname + '/public/index.html');
  // using path module
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

// READ / SELECT ALL IN USERS TABLE
app.get('/users', (req, res) => {
  // targets the users table
  let sql = "SELECT * FROM users"

  connection.query(sql, (err, results) => {
    if (err) {
      return err;
    }
    console.log('these are your results: ', results);
    // how you end your request and the server won't time out
    res.send(results);
  })
});

// READ / SELECT by id
app.get('/users/:id', (req, res, next) => {
  const { id } = req.params;

  let query = `SELECT * FROM ?? WHERE ?? = ?`;
  let inserts = ['users', 'id', id];

  let sql = mysql.format(query, inserts);

  connection.query(sql, (err, results, fields) => {
    if (err) return next(err);

    const output = {
      success: true,
      data: results
    };
    res.json(output);
  });
});

// ADDING USER
app.post('/users', (req, res) => {
  console.log("request body", req.body);

  const { name, email, company } = req.body;

  // let sql = `INSERT INTO users(id, name, course, grade, status) VALUES (NULL, ${name}, ${course}, ${grade}, 1)`;
  // mysql takes question marks as variables
  let query = `INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)`;
  console.log('this is query: ', query);

  // values we're looking for
  // for id we can just skip it in postman, because it's auto incrementing
  let inserts = ['users', 'name', 'email', 'company', name, email, company];

  let sql = mysql.format(query, inserts);

  console.log('formatted sql statement: ', sql);

  connection.query(sql, (err, results, fields) => {
    if (err) {
      return next(err);
    }
    const output = {
      success: true,
      data: results
    }
    res.json(output);
  });

  // end request so server doesn't timeout
  // res.end();
});

// DELETES USER BY ID FROM REQ.BODY
app.post('/users/delete', (req, res, next) => {
  // put into postman using id as key, and value as 6
  const { id } = req.body;

  let query = `DELETE FROM ?? WHERE ?? = ?`;

  let inserts = ['users', 'id', id];

  let sql = mysql.format(query, inserts);

  console.log('formatted sql statement: ', sql);


  connection.query(sql, (err, results, fields) => {
    if (err) return next(err);

    const output = {
      success: true,
      data: results
    };
    res.json(output);
  });
})

// error handling middleware
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(err.status || 500).json("Server not working!");
  }
  next();
});

// process.env.PORT means whatever the environment variable PORT is
app.listen(process.env.PORT || 3001, () => {
  console.log('Server started on PORT: ', PORT);
});
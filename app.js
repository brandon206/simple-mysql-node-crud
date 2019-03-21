// imports express dependency in application
// express returns a function and save it into express variable
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const dbconfig = require('./config/db');

// stores an instance of express in the app variable
const app = express();
// sets up the PORT you want to run on
const PORT = process.env.PORT || 9000;
const connection = mysql.createConnection(dbconfig);

connection.connect((err) => {
    if(err){
        console.log("Error connecting to Database");
        return;
    }
    console.log("Database connected successfully");
});

// consume middleware

// allows us to parse a request sending a content-type of application/json
app.use(express.json());
// uses application/x-www-urlencoded for AJAX, axios uses json
app.use(express.urlencoded({ extended: false })); 

// generate endpoints or routes
app.get('/', (req,res) => {
    // not using path module
    // res.sendFile(__dirname + '/public/index.html');
    // using path module
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

app.get('/users', (req, res) => {
    // targets the students table 
    let sql = "SELECT * FROM users";

    connection.query(sql, (err, results) => {
        if(err){
            return err;
        }
        // how you end your request and the server won't time out
        res.send(results);
    })
});

app.post('/users', (req,res) => {
    console.log("request body", req.body);

    const { name, course, grade }  = req.body;

    // let sql = `INSERT INTO users(id, name, course, grade, status) VALUES (NULL, ${name}, ${course}, ${grade}, 1)`;
    // mysql takes questions marks as variables
    let sql = `INSERT INTO ??(??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)`;
    // values we're looking for 
    // for id we can just skip it in postman, because it's auto incrementing
    let fields = ['students', 'id', 'name', 'course', 'grade', 'status'];
    let values = ['NULL', name, course, grade, '1'];

    sql = mysql.format(sql, [...fields, ...values]);

    console.log("formatted sql statement: ", sql);

    connection.query(sql, (err, results) => {
        if (err) {
            return err;
        }
        res.send(results);
    });
    
    // end request so server doesn't timeout
    // res.end();
});


// error handling middleware


// starting our server
app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`)
});




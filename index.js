//main starting of the application
const express = require('express');
const http = require('http');
const bodyParser = require ('body-parser');
const morgan = require('morgan');
// an instance of express below on app
const app = express();
const router = require('./router');
const mongoose = require('mongoose');


//DB setup
//mongoose.connect('mongodb://localhost/test');
//MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true } , function(error){
    console.log(error);
});

//mongoose.connect('mongodb://localhost:27017/TodoApp');


//app setup - getting express to work the way we want
//morgan and bodyParsers are middleware in express, any incoming reqs to server passed to midwares by default app.use
//morgan- login framework, bodyParser parses incoming reqs into JSON, type:'*/* whatever type into JSon
//index.js usually for server setup only. route handlers in separate directory

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*'}));

//call the router with 'app'

router(app);



//server setup - getting express app talking outside world

//.env.PORT -- if there is an env variable 'PORT' already defined use it otherwise port use 3090
const port = process.env.PORT || 3090;

//'http' native node module low-level http incoming work- create server to receive reqs and forward it to 'app'
const server = http.createServer(app);
server.listen(port);
console.log('server listening on:', port);
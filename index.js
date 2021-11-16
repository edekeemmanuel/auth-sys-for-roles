const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();
// handles public assets
app.use(express.static('public'));
app.use(express.json());
// set database
app.set('db', require('./utils/db'))
// ejs template engine -> for parsing and using javascript in the html files
app.set('view engine', 'ejs');
app.set('views', 'views');

//parse 

app.use(morgan('dev'));

// routes component
const route = moduleName => require(`./modules/${moduleName}/routes`);

// routes -> for the modules
app.use("/", route("sample"));
app.use("/admin", route("admin"));
app.use("/user", route("user"));
app.use("/assignment", route("assignment"));

// error handlers
const { notFoundErrorHandler, serverErrorHandler } = require('./utils/helper');
app.use(serverErrorHandler);
app.use(notFoundErrorHandler);

app.set("port", process.env.PORT || 3000);

module.exports = app;
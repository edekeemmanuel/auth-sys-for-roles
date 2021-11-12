const express = require('express');
const app = express();
const morgan = require('morgan');
const {success, error} = require('consola')
require('dotenv').config();
const db = require('./utils/db');
// handles public assets
app.use(express.static('public'));
// ejs template engine -> for parsing and using javascript in the html files
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.json())

app.use(morgan('dev'));
// routes component
const route = moduleName => require(`./modules/${moduleName}/routes`);
// routes -> for the modules
app.use("/", route("sample"));
app.use("/admin", route("admin"));
app.use("/user", route("user"));

// error handlers
const { serverErrorHandler, notFoundErrorHandler } = require('./utils/helper');
app.use(serverErrorHandler);
app.use(notFoundErrorHandler);

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), _ => success({message: `Server on port ${app.get("port")}`, badge: true}));
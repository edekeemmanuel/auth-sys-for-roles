const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();
// handles public assets
app.use(express.static('public'));
// ejs template engine -> for parsing and using javascript in the html files
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(morgan('dev'));
// routes component
const route = moduleName => require(`./modules/${moduleName}/routes`);
// routes -> for the modules
app.get("/", route("sample"));

// error handlers
const { serverErrorHandler, notFoundErrorHandler } = require('./utils/helper');
app.use(serverErrorHandler);
app.use(notFoundErrorHandler);

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), _ => console.log(`Server on port ${app.get("port")}`));
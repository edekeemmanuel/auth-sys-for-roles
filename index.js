// requiring http//
const http = require("http")
// requiring app.js
const app = require("./app");
// connect server to app
const server = http.createServer(app);


// sets the port to server running
const {API_PORT} = process.env;
const port = process.env.PORT || API_PORT;

// server listening
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
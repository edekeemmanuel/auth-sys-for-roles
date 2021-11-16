const {info} = require("consola")
const app = require("./index");
// app.listen(app.get("port"), _ => console.log(`Server on port ${app.get("port")}`));
app.listen(app.get("port"), _ => info({message: `Server on port ${app.get("port")}`, badge: true}));

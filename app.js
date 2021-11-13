const app = require("./index");
app.listen(app.get("port"), _ => console.log(`Server on port ${app.get("port")}`));
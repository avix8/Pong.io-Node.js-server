const port = process.env.PORT || 4000;
const app = require("./app");
const server = app.listen(port);

var io = require("socket.io").listen(server);
require("./src/ioManager")(io);

var options = require("./evaluator-config3"),
    cube = require("../"),
    server = cube.server(options);

console.log("Connected to cube-lb1-1087",Date());
server.register = function(db, endpoints) {
  cube.evaluator.register(db, endpoints);
};

server.start();

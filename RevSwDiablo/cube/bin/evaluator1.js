var options = require("./evaluator-config1"),
    cube = require("../"),
    server = cube.server(options);

console.log("Connected to cube-lb1-1083",Date());
server.register = function(db, endpoints) {
  cube.evaluator.register(db, endpoints);
};

server.start();

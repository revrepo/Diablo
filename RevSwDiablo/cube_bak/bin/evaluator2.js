var options = require("./evaluator-config2"),
    cube = require("../"),
    server = cube.server(options);

console.log("Connected to cube-lb1-1085",Date());
server.register = function(db, endpoints) {
  cube.evaluator.register(db, endpoints);
};

server.start();

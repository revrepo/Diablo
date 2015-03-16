var options = require("./collector-config2"),
    cube = require("../"),
    server = cube.server(options);

server.register = function(db, endpoints) {
  cube.collector.register(db, endpoints);
};

server.start();

var options = require("../config/collector-config"),
    cube = require("../"),
    server = cube.server(options);

server.register = function(db, endpoints) {
  cube.collector.register(db, endpoints);
};

server.start();

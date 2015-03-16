var mongodb = require("mongodb");

/*********** For SysLog Integration **********/
var revlogger = require("rev-logger");
/*********** For SysLog Integration **********/

var database = module.exports = {};

// Opens MongoDB driver given connection URL and optional options:
//
// {
//   "mongo-url": "",
//   "mongo-options": {
//     "db": { "safe": false },
//     "server": { "auto_reconnect": true },
//     "replSet": { "read_secondary": true }
//   }
// }
//
// See http://docs.mongodb.org/manual/reference/connection-string/ for details.
// You can also specify a Replica Set this way.
//
/**database.open = function(config, callback) {
  var url = config["mongo-url"] || database.config2url(config),
      options = config["mongo-options"] || database.config2options(config);

  revlogger.log('info',"Mongo connecting to the url"+url);
  revlogger.log('info',"Mongo connecting with the option"+options);

  return mongodb.Db.connect(url, options, callback);
};*/

database.open = function(config, callback) {
  var url="";
  if(config["full_connection_string"] && config["full_connection_string"] !="" && config["full_connection_string"]!=undefined) {
    url=config["full_connection_string"];
  } else {
      url = config["mongo-url"] || database.config2url(config);
  }

  var options = config["mongo-options"] || database.config2options(config);

  revlogger.log('info',"Mongo connecting to the url"+url);
  revlogger.log('info',"Mongo connecting with the option"+JSON.stringify(options));

  return mongodb.Db.connect(url, options, callback);
};

//
// For backwards-compatibility you can specify a connection to a single Mongo(s) as follows:
//
// {
//   "mongo-host": "localhost",
//   "mongo-port": "27017",
//   "mongo-server-options": { "auto_reconnect": true },
//   "mongo-database": "cube",
//   "mongo-database-options": { "safe": false },
//   "mongo-username": null,
//   "mongo-password": null,
// }
// (defaults are shown)
//
/**database.config2url = function(config) {
  var user = config["mongo-username"],
      pass = config["mongo-password"],
      host = config["mongo-host"] || "localhost",
      port = config["mongo-port"] || 27017,
      name = config["mongo-database"] || "cube",
      auth = user ? user+":"+pass+"@" : "";
  return "mongodb://"+auth+host+":"+port+"/"+name;
};

database.config2options = function(config) {
  return {
    db: config["mongo-database-options"] || { safe: false },
    server: config["mongo-server-options"] || { auto_reconnect: true },
    replSet: { read_secondary: true }
  };
};*/

database.config2url = function(config) {
  var user = config["mongo-username"],
      pass = config["mongo-password"],
      //host = config["mongo-host"] || "localhost",
      //port = config["mongo-port"] || 27017,
      name = config["mongo-database"] || "cube",
      auth = user ? user+":"+pass+"@" : "";

      var url="";
      var host="";
      if(config["is_replica_set"]) {
        for(val in config["mongo-host"]){
          var port = (config["mongo-port"][val]=="" || config["mongo-port"][val]== undefined)?27017:config["mongo-port"][val];
          if(host=="") {
            host=config["mongo-host"][val]+":"+port;
          } else {
            host=host+","+config["mongo-host"][val]+":"+port;
          }
        }
        url = "mongodb://"+host+"/"+name+"?replicaSet="+config["replica_set_name"]+"&"+config["aditional_params"];
      
        if(config["safe_mode"]) {
          url+="&safe=true&journal="+config["journal"]+"&fsync="+config["fsync"]+"&w="+config["w"];
        }
      } else {
            host = config["mongo-host"][0] || "localhost",
            port = config["mongo-port"][0] || 27017
            url = "mongodb://"+auth+host+":"+port+"/"+name;
            
            if(config["safe_mode"]) {
              url+="?safe=true&journal="+config["journal"]+"&fsync="+config["fsync"]+"&w="+config["w"];
            }
      }
    return url;
};

database.config2options = function(config) {
  return {
    db: config["mongo-database-options"] || { safe: config["safe_mode"] },
    server: config["mongo-server-options"] || { auto_reconnect: config["auto_reconnect"] },
    replSet: { read_secondary: true }
  };
};

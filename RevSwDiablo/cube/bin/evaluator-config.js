// Default configuration for development.
/**module.exports = {
//  "mongo-host": "54.164.15.59",
  "mongo-host": "54.172.164.21",
  "mongo-port": 27017,
  "mongo-database": "cube_development",
  "mongo-username": null,
  "mongo-password": null,
  "http-port": 1081
};*/

module.exports = {
  "mongo-host": ["54.164.198.250","54.164.31.156","54.173.83.184"],
  //"mongo-host": ["127.0.0.1"],
  "mongo-port": [27017,27017,27017],
  "is_replica_set": true,
  "replica_set_name":"diabloreplica",
  "aditional_params":"slaveOK=true&readPreference=secondaryPreferred&connectWithNoPrimary=true",
  //"full_connection_string":"mongodb://54.164.198.250:27017,54.164.31.156:27017,54.173.83.184:27017/cube_development?replicaSet=diabloreplica&slaveOK=true&readPreference=secondaryPreferred&connectWithNoPrimary=true&safe=true&journal=true&fsync=false&w=1",
  "safe_mode":true,
  "journal":true, // both journal and fsync should nt be true. either of them should be true
  "fsync":false,
  "w":1,
  "auto_reconnect":true,
  "mongo-database": "cube_development",
  "mongo-username": null,
  "mongo-password": null,
  "http-port": 1081
};



const { MongoClient, ServerApiVersion } = require('mongodb');
//DB connStr 
//const connStr =  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const connStr = "mongodb://demicon:dsalkhşSAdjh43@userapi-shard-00-00.fpeih.mongodb.net:27017,userapi-shard-00-01.fpeih.mongodb.net:27017,userapi-shard-00-02.fpeih.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-zm521t-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(connStr, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	serverApi: ServerApiVersion.v1 });

module.exports = client
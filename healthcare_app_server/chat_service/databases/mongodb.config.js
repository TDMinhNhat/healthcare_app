const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

(async () => {
    try {
        await client.connect();
        await client.db("admin").command({ ping : 1 });
        console.log("Connect successfully to MongoDB server");
    } catch (error) {
        console.log(error);
    }
})();

module.exports = client.db("chat_service");


const MongoClient = require('mongodb').MongoClient;

let client = null;

async function connectToDB(databaseName, collectionName) {
  try {
    if (!client) {
      client = new MongoClient(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    await client.connect();
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);
    return collection;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

module.exports = { connectToDB };

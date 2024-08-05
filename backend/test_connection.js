const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://adminleaked:HammerCity1@food-ordering-app.e34prri.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'leaked_data';

async function testConnection() {
    let client;
    try {
        client = await MongoClient.connect(uri);
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections);
    } catch (err) {
        console.error('Failed to connect to MongoDB', err.message);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

testConnection();

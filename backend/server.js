const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 10100;

const uri = 'mongodb+srv://adminleaked:HammerCity1@food-ordering-app.e34prri.mongodb.net/leaked_data?retryWrites=true&w=majority';
const dbName = 'leaked_data'; // Your database name
const collectionName = 'leaked_data'; // Your collection name

let collection;

app.use(cors());
app.use(bodyParser.json());

async function connectToMongoDB() {
    try {
        console.log('Attempting to connect to MongoDB...');
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connection successful');

        const db = client.db(dbName);
        collection = db.collection(collectionName);
        console.log('Connected to MongoDB');

        app.listen(PORT, 'localhost', () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
}

connectToMongoDB();

app.post('/search', async (req, res) => {
    const { query, filter, page = 1, limit = 50 } = req.body;
    const currentPage = Math.max(parseInt(page, 10), 1);
    const resultsPerPage = Math.max(parseInt(limit, 10), 1);

    if (!collection) {
        return res.status(500).send('Database connection is not available');
    }

    try {
        const sanitizedQuery = query ? query.trim() : '';
        const sanitizedFilter = filter === 'website' || filter === 'username' ? filter : 'username';

        const queryObject = sanitizedFilter === 'website'
            ? { url: { $regex: `.*${sanitizedQuery}.*`, $options: 'i' } }
            : { username: { $regex: `.*${sanitizedQuery}.*`, $options: 'i' } };

        console.log('Query Object:', JSON.stringify(queryObject));

        const totalResults = await collection.countDocuments(queryObject);
        console.log('Total Results:', totalResults);

        const results = await collection.find(queryObject)
            .skip((currentPage - 1) * resultsPerPage)
            .limit(resultsPerPage)
            .toArray();

        console.log('Results:', results);

        const totalPages = Math.ceil(totalResults / resultsPerPage);

        res.json({
            results: results,
            page: currentPage,
            totalPages: totalPages
        });
    } catch (err) {
        console.error('Error in search route:', err.message);
        res.status(500).send('Error retrieving documents');
    }
});

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mihir:mihir@ecovoyage.fwyxr.mongodb.net/?retryWrites=true&w=majority&appName=EcoVoyage";
const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/', async (req, res) => {
    try {
        res.send('Transport route called');
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

router.get('/top', async (req, res) => {
    try {
        const client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
        });
        const db = client.db("ecovoyage");
        const coll = db.collection("attractions");
        const attractions = await coll.find().toArray();
    await res.status(200).json({
        success: true,
        message: 'Top 50 Attractions',
        result: {
            attractions: attractions
        }
    });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.toString(),
        });
    }
});
module.exports = router;
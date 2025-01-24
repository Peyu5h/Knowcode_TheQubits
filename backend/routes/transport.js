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

router.post('/find', async (req, res) => {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        const db = client.db("ecovoyage");
        const coll = db.collection("airports");
        const result = await coll.aggregate([
            {
                $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [72.87121, 19.045561],
                },
                distanceField: "distance",
                spherical: true,
                },
            },
            {
                $limit: 5,
            }
            ]).toArray();
        console.log(result);
        await client.close();
        res.status(200).json({
            success: true,
            message: 'Find successful',
            user: req.body,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.toString(),
        });
    }
});

module.exports = router;
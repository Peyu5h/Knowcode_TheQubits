const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mihir:mihir@ecovoyage.fwyxr.mongodb.net/?retryWrites=true&w=majority&appName=EcoVoyage";

const router = express.Router();

router.use(express.json());

router.get('/', async (req, res) => {
    try {
        res.send('User route called');
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

router.post('/login', async (req, res) => {
    
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        const { email, password } = req.body;
        const db = client.db("ecovoyage");
        const coll = db.collection("users");  
        const user = await coll.findOne({ email, password });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        } else {
            res.status(200).json({
                success: true,
                message: 'Login successful',
                result: user,
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.toString(),
        });
    } finally {
        await client.close();
    }
});

router.post('/signUp', async (req, res) => {
    try {
        const { name, email, phone, password, gender, age } = req.body;
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        const db = client.db("ecovoyage");
        const coll = db.collection("users");  
        const user = {
            name,
            email,
            phone,
            password,
            gender,
            age
        };
        const existing = await coll.findOne({ email });
        if(existing) return;
        const result = await coll.insertOne(user);
        res.status(200).json({
            success: true,
            message: 'Signing up successful',
            result: user,
        });
        await client.close();
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.toString(),
        });
    }
});

module.exports = router;
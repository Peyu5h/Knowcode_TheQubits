const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@ecovoyage.fwyxr.mongodb.net/?retryWrites=true&w=majority&appName=EcoVoyage";

app.get('/', (req, res) => {
    res.send('EcoVoyage API!');
});

app.use('/user', require('./routes/user'));
app.use('/transport', require('./routes/transport'));

app.listen(port, async () => {
    console.log(`Server started at http://localhost:${port}`);
})
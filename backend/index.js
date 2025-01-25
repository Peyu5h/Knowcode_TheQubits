const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const puppeteer = require('puppeteer');
const uri = "mongodb+srv://admin:admin@ecovoyage.fwyxr.mongodb.net/?retryWrites=true&w=majority&appName=EcoVoyage";

app.use(cors({
  origin: '*'
}));
app.get('/', (req, res) => {
    res.send('EcoVoyage API!');
});
app.get('/test', (req, res) => {
  res.json({ message: 'You got this!' });
});

app.use('/user', require('./routes/user'));
app.use('/transport', require('./routes/transport'));
app.use('/accomodation', require('./routes/accomodation'));
app.use('/attractions', require('./routes/attractions'));

app.listen(port, async () => {
  /*const client = new MongoClient(uri, {
              serverApi: {
                  version: ServerApiVersion.v1,
                  strict: true,
                  deprecationErrors: true,
              }
          });
          const db = client.db("ecovoyage");
  const coll = db.collection("cities");
  const rawData = fs.readFileSync('cities.json');
  const json = JSON.parse(rawData);
  const transformed = json.map(location => ({
    name: location.name,
    location: {
        type: 'Point',
        coordinates: [
            parseFloat(location.longitude),
            parseFloat(location.latitude)
        ]
    }
}));
  await coll.insertMany(transformed);*/
    console.log(`Server started at http://localhost:${port}`);
})
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

app.listen(port, async () => {
  /*const client = new MongoClient(uri, {
              serverApi: {
                  version: ServerApiVersion.v1,
                  strict: true,
                  deprecationErrors: true,
              }
          });
          const db = client.db("ecovoyage");
  const coll = db.collection("railways");
  const rawData = fs.readFileSync('stations.json');
  const features = JSON.parse(rawData).features;
  const transformed = features.map(feature => {
    if (feature.geometry && feature.properties.code && feature.properties.name) {
      return {
        name: feature.properties.name,
        state: feature.properties.state,
        code: feature.properties.code,
        location: {
            type: "Point",
            coordinates: feature.geometry.coordinates
        }
      };
    }
  });
  //console.log(transformed);
  await coll.insertMany(transformed);*/
  //await scrapeTrains();
    console.log(`Server started at http://localhost:${port}`);
})
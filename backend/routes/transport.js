const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mihir:mihir@ecovoyage.fwyxr.mongodb.net/?retryWrites=true&w=majority&appName=EcoVoyage";
const express = require('express');
const puppeteer = require('puppeteer');
const Fuse = require('fuse.js');
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
        const {fromLocation, toLocation, startDate, passengers}= req.body;
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
                    coordinates: [fromLocation.lng, fromLocation.lat],
                },
                distanceField: "distance",
                spherical: true,
                },
            },
            {
                $limit: 3,
            }
        ]).toArray();
        const result2 = await coll.aggregate([
            {
                $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [toLocation.lng, toLocation.lat],
                },
                distanceField: "distance",
                spherical: true,
                },
            },
            {
                $limit: 3,
            }
        ]).toArray();
        const fuse = new Fuse(result2, {
            keys: ['name'],
            threshold: 0.3,
            includeScore: true
        });
        const finalResults = fuse.search(toLocation.name)
        .map(result => ({
            ...result.item,
            matchScore: 1 - (result.score || 0)
        }))
        .sort((a, b) => {
            return b.matchScore - a.matchScore || a.distance - b.distance;
        })
        .slice(0, 3);
        console.log(result);
        console.log(finalResults);
        await scrapeFlights(`https://www.cleartrip.com/flights/international/results?adults=${passengers}&childs=0&infants=0&class=Economy&depart_date=${formatDate(startDate)}&from=${result[0].IATA}&to=${finalResults[0].IATA}`);
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

function formatDate(isoString) {
    const date = new Date(isoString);
    
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    return `${day}/${month}/${year}`;
  }
  

  async function scrapeFlights(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".intl-grid-template");
    
    const flights = await page.evaluate(() => {
        const flightBlocks = Array.from(document.querySelectorAll(".intl-grid-template")).slice(0, 5);
        return flightBlocks.map(block => {
            // Always scope selectors to the block element
            const airlineLogo = block.querySelector("img[alt]")?.src || "";
            const airlineName = block.querySelector(".c-neutral-900.fs-1.fw-500")?.innerText.trim() || "";
            
            const departureElement = block.querySelector(".ms-grid-column-1 .fs-6.fw-500");
            const departureTimeMatch = departureElement?.innerText.match(/\d{2}:\d{2}/);
            const departureTime = departureTimeMatch ? departureTimeMatch[0] : "";
            
            const arrivalElement = block.querySelector(".ms-grid-column-2.ms-grid-row-1 .fs-6.fw-500");
            const arrivalText = arrivalElement?.innerText.trim() || "";
            const [arrivalTime, arrivalDate] = arrivalText.split("\n");
            
            const sourceAirport = block.querySelector("p.m-0.fs-2.c-neutral-700 span.c-neutral-500.fw-500.fs-2")?.innerText.trim() || "";
            const destinationAirport = block.querySelector("p.m-0.fs-2.c-neutral-700 div:nth-child(2) span.c-neutral-500.fw-500.fs-2")?.innerText.trim() || "";
            
            const journeyTime = block.querySelector(".ms-grid-column-3 .fs-3.lh-28.fw-500")?.innerText.trim() || "";
            
            const stopsElement = block.querySelector('[id*="stopsCallout2"]');
            const stopsText = stopsElement?.innerText.trim() || "";
            const stops = stopsText.includes("non-stop") ? 0 : parseInt(stopsText.match(/\d+/)?.[0] || 0);
            
            const priceElement = block.querySelector(".fs-6.fw-600.c-neutral-900");
            const price = priceElement?.innerText.trim() || "";

            return {
                airlineLogo,
                airlineName,
                departureTime,
                arrivalTime: arrivalTime || "",
                arrivalDate: arrivalDate || "",
                sourceAirport,
                destinationAirport,
                journeyTime,
                stops,
                price
            };
        });
    });

    console.log(flights);
    await browser.close();
}

module.exports = router;
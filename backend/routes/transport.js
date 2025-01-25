const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mihir:mihir@ecovoyage.fwyxr.mongodb.net/?retryWrites=true&w=majority&appName=EcoVoyage";
const express = require('express');
const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const Fuse = require('fuse.js');
const axios = require('axios');
const router = express.Router();

var flightsArr = [];
var trainsArr = [];
var busesArr = [];

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
        await Promise.all([
            lookUpFlights(req),
            lookUpTrains(req),
        ]);
        await res.status(200).json({
            success: true,
            message: 'Find successful',
            result: {
                flights: flightsArr,
                trains: trainsArr,
            }
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.toString(),
        });
    }
});

async function lookUpFlights(req) {
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
    console.log(result);
    console.log(result2);
    const fuse = new Fuse(result2, {
        keys: ['name'],
        threshold: 0.5,
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
    console.log(finalResults);
    console.log(`https://www.cleartrip.com/flights/international/results?adults=${passengers}&childs=0&infants=0&class=Economy&depart_date=${formatDate(startDate)}&from=${result[0].IATA}&to=${finalResults[0].IATA}`);
    const flights = await scrapeFlights(`https://www.cleartrip.com/flights/international/results?adults=${passengers}&childs=0&infants=0&class=Economy&depart_date=${formatDate(startDate)}&from=${result[0].IATA}&to=${finalResults[0].IATA}`, result[0].country === finalResults[0].country ? true : false);
    if (flights != null && flights != undefined && flights.length > 0) {
        flightsArr = flights.slice(0, 5);
    } else {
        flightsArr = null;
    }
}

async function lookUpTrains(req) {
    const { fromLocation, toLocation, startDate, passengers } = req.body;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    const db = client.db("ecovoyage");
    const coll = db.collection("railways");  
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
    if (result.length > 0 && finalResults.length > 0) { 
        var trainy = await scrapeTrains(result[0].code, finalResults[0].code, formatDateRed(startDate));
        trainsArr = trainy.slice(0, 5);
    } else {
        trainsArr = null;
    }
}

function formatDateRed(isoString) {
    const date = new Date(isoString);
    
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    return `${year}${month}${day}`;
}

function haversine(lat1, lon1, lat2, lon2, unit = 'km') {
    const R = unit === 'km' ? 6371 : 3958.8;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
   

function formatDate(isoString) {
    const date = new Date(isoString);
    
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    return `${day}/${month}/${year}`;
}
  

async function scrapeFlights(url, domestic) {
    const browser = await puppeteer.launch({ headless: false, args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-features=IsolateOrigins,site-per-process',
        '--blink-settings=imagesEnabled=false' 
      ], });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    try {
        var flights = [];
        if (domestic) {
            await page.waitForSelector('div[data-testid="tupple"]', {timeout: 20000});

            flights = await page.$$eval('div[data-testid="tupple"]', (blocks) => {
                return blocks.map(block => {
                  // Helper function with safe element handling
                  const getText = (selector) => 
                    block.querySelector(selector)?.textContent?.trim() || 'N/A';
              
                  // Extract flight details
                  return {
                    airlineLogo: block.querySelector('img[alt]')?.src || '',
                    airlineName: getText('p.fw-500.fs-2.c-neutral-900'),
                    departureTime: getText('.ms-grid-column-1 .fs-5.fw-400')?.match(/\d{2}:\d{2}/)?.[0] || '',
                    arrivalTime: getText('.ms-grid-column-1.ms-grid-row-1 .fs-5.fw-400')?.match(/\d{2}:\d{2}/)?.[0] || '',
                    arrivalDate: getText('.ms-grid-row-2 .fs-2.c-neutral-400'),
                    sourceAirport: getText('.ms-grid-column-1 .fs-2.c-neutral-400'),
                    destinationAirport: getText('.ms-grid-column-3 .fs-2.c-neutral-400'),
                    journeyTime: getText('.ms-grid-column-3 .fs-2.fw-400'),
                    stops: parseInt(getText('[id*="stopsCallout2"]')?.match(/\d+/)?.[0] || 0),
                    price: getText('.fs-5.fw-700.c-neutral-900')?.replace('₹', '') || '0'
                  };
                });
              });
        } else {
            await page.waitForSelector(".intl-grid-template", {timeout: 20000});
            const gridExists = await page.$('.intl-grid-template').catch(() => null);
            if (!gridExists) return null;
        
            const flights = await page.evaluate(() => {
                const flightBlocks = Array.from(document.querySelectorAll(".intl-grid-template")).slice(0, 5);
                return flightBlocks.map(block => {
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
        }
        return flights;
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        //await browser.close();
    }
}

async function scrapeBuses(from, to, date) {
    const browser = await puppeteer.launch({ headless: "new", args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-features=IsolateOrigins,site-per-process',
        '--blink-settings=imagesEnabled=false' 
      ],});
  const page = await browser.newPage();
  
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
  );
    await page.goto('https://www.redbus.in/bus-tickets/mumbai-to-delhi?fromCityName=Mumbai&toCityName=Delhi&onward=28-Jan-2025&opId=0&busType=Any');

    const redirectedUrl = page.url();
    const urlObj = new URL(redirectedUrl);
    const params = urlObj.searchParams;
    const convertISODate = (iso) => {
        const date = new Date(iso);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        return `${day}-${month}-${date.getUTCFullYear()}`;
    };
    const newOnwardDate = convertISODate("2025-01-28T16:14:34.818Z");
    params.set('onward', newOnwardDate);
    const updatedUrl = urlObj.toString();
    await page.goto(updatedUrl, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.row-sec.clearfix');

    const buses = await page.$$eval('.row-sec.clearfix', (busElements) => {
      return busElements.map(bus => {
        return {
          name: bus.querySelector('.travels').innerText.trim(),
          type: bus.querySelector('.bus-type').innerText.trim(),
          departureTime: bus.querySelector('.dp-time').innerText.trim(),
          arrivalTime: bus.querySelector('.bp-time').innerText.trim(),
          arrivalDate: bus.querySelector('.next-day-dp-lbl').innerText.trim(),
          journeyTime: bus.querySelector('.dur').innerText.trim(),
          rate: bus.querySelector('.seat-fare .f-19.f-bold').innerText.trim()
        };
      });
    });
    await browser.close();
    return buses;
}

/*async function scrapeBuses(from, to, date) {
    const browser = await puppeteer.launch({ headless: "new", args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-features=IsolateOrigins,site-per-process',
        '--blink-settings=imagesEnabled=false' 
      ],});
  const page = await browser.newPage();
  
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
  );
    await page.goto('https://www.redbus.in/bus-tickets/mumbai-to-delhi?fromCityName=Mumbai&toCityName=Delhi&onward=28-Jan-2025&opId=0&busType=Any');

    const redirectedUrl = page.url();
    const urlObj = new URL(redirectedUrl);
    const params = urlObj.searchParams;
    const convertISODate = (iso) => {
        const date = new Date(iso);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        return `${day}-${month}-${date.getUTCFullYear()}`;
    };
    const newOnwardDate = convertISODate("2025-01-28T16:14:34.818Z");
    params.set('onward', newOnwardDate);
    const updatedUrl = urlObj.toString();
    await page.goto(updatedUrl, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.row-sec.clearfix');

    const buses = await page.$$eval('.row-sec.clearfix', (busElements) => {
      return busElements.map(bus => {
        return {
          name: bus.querySelector('.travels').innerText.trim(),
          type: bus.querySelector('.bus-type').innerText.trim(),
          departureTime: bus.querySelector('.dp-time').innerText.trim(),
          arrivalTime: bus.querySelector('.bp-time').innerText.trim(),
          arrivalDate: bus.querySelector('.next-day-dp-lbl').innerText.trim(),
          journeyTime: bus.querySelector('.dur').innerText.trim(),
          rate: bus.querySelector('.seat-fare .f-19.f-bold').innerText.trim()
        };
      });
    });
    await browser.close();
    return buses;
}*/

async function scrapeTrains(from, to, date) {
    const browser = await puppeteer.launch({ headless: false, args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-features=IsolateOrigins,site-per-process',
        '--blink-settings=imagesEnabled=false' 
      ],});
  const page = await browser.newPage();
  
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
    );
    
    console.log(`https://www.redbus.in/railways/search?src=${from}&dst=${to}&doj=${date}&fcOpted=false`);
  await page.goto(`https://www.redbus.in/railways/search?src=${from}&dst=${to}&doj=${date}&fcOpted=false`, { waitUntil: 'networkidle2' });
  
  await page.waitForSelector('.search_tupple_wrapper', { timeout: 15000 });

  const trains = await page.$$eval('.search_tupple_wrapper', (elements) => {
    return elements.map(el => {
      const getText = (selector) => 
        el.querySelector(selector)?.textContent?.trim() || 'N/A';

      try {
        return {
          trainNumber: getText('.srp_train_code'),
          trainName: getText('.srp_train_name')?.replace(/&nbsp;/g, ''),
          departureTime: getText('.srp_departure_time')?.replace(/\s+/g, ''),
          fromStation: getText('.srp_src_dst_stations > div:first-child'),
          arrivalTime: getText('.srp_arrival_time')?.replace(/\s+/g, ''),
          toStation: getText('.srp_src_dst_stations > div:last-child'),
          price: getText('.searchtrainClasses .tuple_fare').replace(/\D/g, '')
        };
      } catch (error) {
        console.warn('Error parsing element:', error);
        return null;
      }
    }).filter(Boolean);
  });
  trains.slice(0,5).sort((a, b) => {
    const priceA = parseInt(a.price, 10);
    const priceB = parseInt(b.price, 10);
    
    return priceA - priceB;
  });
    await browser.close();
    return trains;
}

module.exports = router;
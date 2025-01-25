const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mihir:mihir@ecovoyage.fwyxr.mongodb.net/?retryWrites=true&w=majority&appName=EcoVoyage";
const express = require('express');
const puppeteer = require('puppeteer-extra');
const Fuse = require('fuse.js');
const axios = require('axios');
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
        const { fromLocation, toLocation, startDate, endDate, passengers } = req.body;
    const url = `https://ecohotels.com/hotels/india/${toLocation.name.toLowerCase()}/?checkin=${formatDate(startDate)}&checkout=${formatDate(endDate)}&rooms=${passengers}&rehid=`;
    console.log(url);
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
    await page.setViewport({ width: 1280, height: 800 });
    /*await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
      );*/
    await page.goto(url, { waitUntil: "networkidle2" });
        await page.waitForSelector('.col-span-12.md\\:col-span-6', { timeout: 40000 });
        await page.waitForFunction(() => {
            const hotels = document.querySelectorAll('.col-span-12.md\\:col-span-6');
            return hotels.length > 0;
          }, { timeout: 60000 });
      const hotels = await page.$$eval('.col-span-12.md\\:col-span-6.lg\\:col-span-6.xl\\:col-span-12', (hotelElements) => {
  return hotelElements.map(hotel => {
    const stars = hotel.querySelectorAll('svg[viewBox="0 0 29 27"] path[fill="var(--color-greenprimary)"]').length / 2;

    const certifications = [...new Set(
        Array.from(hotel.querySelectorAll('div.flex.flex-wrap.gap-3 p.text-\\[0\\.8rem\\], p.text-\\[0\\.75rem\\]'))
          .map(el => el.textContent.trim())
          .filter(text => 
            !text.match(/Includes taxes|charges/i) && 
            !text.match(/Eco-certifications/i)
          )
      )];

    const pricePerNight = Array.from(hotel.querySelectorAll('span'))
      .find(el => el.textContent.includes('/ Night'))
      ?.textContent?.match(/\d{1,3}(?:,\d{3})*/)?.[0]
      ?.replace(/,/g, '') || '0';

    const images = [...new Set(
      Array.from(hotel.querySelectorAll('.swiper-slide img[src]'))
        .map(img => img.src)
    )];
      console.log((0.5 * certifications.length));
    return {
      name: hotel.querySelector('h2.font-ManropeBold')?.textContent?.trim() || '',
        ecoScore: stars,
      //ecoScore: 2 * (0.5*stars) * (0.5*certifications.length),
      certifications,
      pricePerNight: parseInt(pricePerNight, 10) * 90,
      images
    };
  });
      });
    const filtered = hotels.filter(hotel => hotel.name && hotel.name.length > 0 && hotel.pricePerNight > 0);
    //await browser.close();
    await res.status(200).json({    
        success: true,
        message: 'Find successful',
        result: {
            hotels: filtered
        }
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
    
    return `${year}-${month}-${day}`;
}

async function scrapeHotels(url) {
    
}

module.exports = router;
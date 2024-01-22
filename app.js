const express = require('express');
const https = require('https');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/books', function (req, res) {
    res.sendFile(__dirname + '/views/books.html');
});

app.get('/museum', function (req, res) {
    res.sendFile(__dirname + '/views/museum.html');
});

app.get('/weather', function (req, res) {
    const cityName = req.query.cityName;

    if (!cityName) {
        res.status(400).send('CityName parameter is required');
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=2448beca9400d4c1e0c72997e2fa8b57&units=metric`;

    https.get(weatherUrl, function (response) {
        console.log(response.statusCode);
        let rawData = '';

        response.on('data', function (chunk) {
            rawData += chunk;
        });

        response.on('end', function () {
            try {
                const weatherdata = JSON.parse(rawData);

                const temp = weatherdata.main.temp;
                const feelsLike = weatherdata.main.feels_like;
                const humidity = weatherdata.main.humidity;
                const pressure = weatherdata.main.pressure;
                const windSpeed = weatherdata.wind.speed;
                const weatherdescription = weatherdata.weather[0].description;
                const icon = weatherdata.weather[0].icon;
                const imageURL = `https://openweathermap.org/img/wn/${icon}.png`;

                const coordinates = weatherdata.coord;
                const countryCode = weatherdata.sys.country;
                const rainVolume = weatherdata.rain ? weatherdata.rain['1h'] || 0 : 0;

                const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyDD1ogD8nPSLflYFgltd1HZVPDxEk9EkVU&center=${coordinates.lat},${coordinates.lon}&zoom=10`;
                const responseData = {
                    temp,
                    imageURL,
                    feelsLike,
                    weatherdescription,
                    humidity,
                    pressure,
                    windSpeed,
                    coordinates,
                    countryCode,
                    rainVolume,
                    mapUrl
                };
        
                res.json(responseData);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    });
});

app.get('/bestsellers', async function (req, res) {
    try {
        const apiKey = 'WJowE5lwzxGfaRheBtK5tjoDyYCGYvS9';
        let listType = req.query.type || 'hardcover-fiction';
        if (listType !== 'hardcover-fiction' && listType !== 'hardcover-nonfiction') {
            res.status(400).json({ error: 'Invalid list type specified' });
            return;
        }

        const response = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/${listType}.json?api-key=${apiKey}`);
        const books = response.data.results.books;

        res.json(books);
    } catch (error) {
        console.error('Error getting NYT Best Sellers List:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/artworks', async function (req, res) {
    try {
        const apiKey = '5jLUx1H6';

        const response = await axios.get(`https://www.rijksmuseum.nl/api/nl/collection?key=${apiKey}&involvedMaker=Rembrandt+van+Rijn`);

        const artworks = {
            elapsedMilliseconds: 0,
            count: response.data.count,
            artObjects: response.data.artObjects.map(artwork => ({
                links: artwork.links,
                id: artwork.id,
                objectNumber: artwork.objectNumber,
                title: artwork.title,
                principalOrFirstMaker: artwork.principalOrFirstMaker,
                webImage: artwork.webImage,
                productionPlaces: artwork.productionPlaces,
            })),
        };

        res.json(artworks);
    } catch (error) {
        console.error('Error getting artworks from Rijksmuseum API:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});

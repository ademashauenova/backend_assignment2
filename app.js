const express = require('express');
const https = require('https');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/books', function (req, res) {
    res.sendFile(__dirname + '/views/books.html');
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


                // res.write('<div class="weather-container">');
                // res.write(`<h1>Temperature in ${cityName} is ${temp} C</h1>   <img src="${imageURL}" alt="Weather icon">`);
                // // res.write(`<img src="${imageURL}" alt="Weather icon">`);
                // res.write(`<h4>Feels like ${feelsLike} C</h4>`);
                // res.write(`<h3>The weather is currently ${weatherdescription}</h3>`);
                // res.write(`<h3>Humidity is ${humidity} %</h3>`);
                // res.write(`<h3>Pressure is ${pressure} mb</h3>`);
                // res.write(`<h3>Wind speed is ${windSpeed} m/s</h3>`);
                // res.write(`<h3>Coordinates: Lat ${coordinates.lat}, Lon ${coordinates.lon}</h3>`);
                // res.write(`<h3>Country code is ${countryCode}</h3>`);
                // res.write(`<h3>Rain volume for the last 3 hours is ${rainVolume} mm</h3>`);
                // res.write(`<iframe width="600" height="450" frameborder="0" style="border:0" src="${mapUrl}" allowfullscreen></iframe>`);
                
                // res.end();
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

// app.get('/bestsellers', async function (req, res) {
//     try {
//         const apiKey = 'WJowE5lwzxGfaRheBtK5tjoDyYCGYvS9';

//         const response = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`);
//         const books = response.data.results.books;

//         // console.log('NYT Best Sellers List - Hardcover Fiction:');
//         // books.forEach(book => {
//         //     console.log(`Title: ${book.title}`);
//         //     console.log(`Author(s): ${book.author}`);
//         //     console.log(`Description: ${book.description}`);
//         //     console.log('---');
//         // });

//         res.json(books);
//     } catch (error) {
//         console.error('Error getting NYT Best Sellers List:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.get('/bestsellers', async function (req, res) {
//     try {
//         const apiKey = 'WJowE5lwzxGfaRheBtK5tjoDyYCGYvS9';

//         const response = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/hardcover-nonfiction.json?api-key=${apiKey}`);
//         const books = response.data.results.books;

//         res.json(books);
//     } catch (error) {
//         console.error('Error getting NYT Best Sellers List:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

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


app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});

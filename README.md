### Weather App Documentation

## Table of Contents
- Project Overview
- Installation
- NPM Packages
- API Usage
  - Openweather API
  - Google Maps API
  - Additional APIs
- Design Decisions

## Project Overview

The Weather App is a web application built using Express.js, Bootstrap, and jQuery. It provides weather information, NYT best sellers lists, and artworks from the Rijksmuseum API. The app is organized into three main sections: Weather, NYT Best Sellers, and Rijksmuseum.

## Installation

1. Clone the repository: `git clone https://github.com/ademashauenova/backend_assignment2.git`
2. Navigate to the project folder: `cd backend_assignment2`
3. Install dependencies: `npm install`
4. Run the server: `nodemon app.js`
5. Open your browser and visit `http://localhost:3000`

## npm packages/dependencies

- Express.js
- axios

## API Usage

# Weather API
Endpoint: /weather
Method: GET
Parameters: cityName
Response: JSON object containing weather details such as temperature, feels like, humidity, pressure, wind speed, and more.

## Google Maps API
Method: GET
Parameters: latitude, longitude
Response: Map visually showcasing the location of cities based on latitude and longitude.

# NYT Best Sellers API
Endpoint: /bestsellers
Method: GET
Parameters: type
Response: JSON array containing details of books in the specified best sellers list.

# Rijksmuseum API
Endpoint: /artworks
Method: GET
Response: JSON object containing details of artworks by Rembrandt van Rijn from the Rijksmuseum API.


## Design Decisions
# Navbar
The app features a responsive navigation bar fixed to the top, providing easy access to different sections: Weather, Book Bestsellers, and Rijksmuseum.

# Weather Section
Weather information is displayed in a card format, with temperature, feels like, weather description, humidity, pressure, wind speed, coordinates, country code, rain volume, and a map.
The map is embedded using the Google Maps API.

# NYT Best Sellers Section
Books from the NYT Best Sellers list are presented in two categories: Hardcover Fiction and Hardcover Nonfiction.

# Rijksmuseum Section
Artworks by Rembrandt van Rijn from the Rijksmuseum API are displayed with details such as title, production places, and images.

# Responsiveness
The website is designed to be responsive, with media queries adjusting panel sizes for optimal viewing on various screen sizes.

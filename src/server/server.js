const dotenv = require("dotenv");
const bodyParser = require('body-parser')
const cors = require('cors')
const fetch = require('node-fetch');
const userName = "rsaddique";
API_KEY_IMAGES = '22275089-7160855d31b5a4850f4f9b574';
API_KEY_WEATHERBIT = '003cc4d30ca849d18e8cd717c7a65f97';

var path = require('path')
const express = require('express');

// const mockAPIResponse = require('./mockAPI.js')

dotenv.config();
const app = express()
const weatherbitApiKey = process.env.API_KEY_WEATHERBIT;
const pixabayApiKey = process.env.API_KEY_IMAGES;


app.use(express.static('dist'))
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'))
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

// app.get('/test',  function (req, res) {
//     res.send(mockAPIResponse)
// })
app.post('/city', async (req, res)=>{
    console.log('Hello',req.body)
    const cityName = req.body.formText;
   
    const lang= 'en';
    const response = await fetch(`http://api.geonames.org/searchJSON?q=${cityName}&maxRows=1&username=${userName}`)
    const {geonames} = await response.json();
    let {population,countryCode,fclName,lng,lat,countryName} = geonames[0];
    res.send({population,countryCode,fclName,lng,lat,countryName});
})
app.get('/city', async (req, res)=>{
    const cityName = req.query.city;
   
    const lang= 'en';
    const response = await fetch(`http://api.geonames.org/searchJSON?q=${cityName}&maxRows=1&username=${userName}`)
    const {geonames} = await response.json();
    let {population,countryCode,fclName,lng,lat,countryName} = geonames[0];
    res.send({population,countryCode,fclName,lng,lat,countryName});
})
app.post('/currentWeather', async(req, res) => {
    console.log('', req.body);
    const {lat,lon}= req.body;
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${weatherbitApiKey}&units=M`);
    const {data} = await response.json();
    let {sunset, temp, timezone, wind_spd} = data[0];
    res.send({sunset, temp, timezone, wind_spd});
})

app.get('/currentWeather', async (req, res) => {
    const {lat,lon}= req.query;
    console.log(req.query)
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${req.query.lat}&lon=${req.query.lon}&key=${weatherbitApiKey}&units=M`).catch(err=>{
        console.log(err)
    });
    const {data} = await response.json();
    console.log("data",data) 
    let {sunset, temp, timezone, wind_spd} = data[0];
    res.send({sunset, temp, timezone, wind_spd});
})

app.post('/forecastWeather', async(req, res) => {
    console.log('', req.body);
  
    const {lat,lon}= req.body;
    const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${weatherbitApiKey}&units=M`);
    const {data} = await response.json();

    const forecast = data.map(({min_temp,max_temp}) =>  {
        return {min_temp,max_temp};
    })
    console.log(forecast);
    res.send(forecast);
})


app.post('/image', async(req, res) => {
    console.log('', req.body);
    let cityName="karachi";
    const response = await fetch(`https://pixabay.com/api/?key=${pixabayApiKey}&q=city+${cityName}&image_type=photo`);
    const {hits} = await response.json();

const picture = hits.map(({previewURL}) =>  {
        return {previewURL};
    })
    res.send(picture);
})

app.get('/image', async(req, res) => {
    console.log('', req.body);
    let cityName=req.query.city;
    const response = await fetch(`https://pixabay.com/api/?key=${pixabayApiKey}&q=city+${cityName}&image_type=photo`);

    const {hits} = await response.json();

    console.log("HELLO",hits)

const picture = hits.map(({previewURL}) =>  {
        return {previewURL};
    })
    res.send(picture);
})
    


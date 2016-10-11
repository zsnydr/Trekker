var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var geocoder = require('geocoder');
var helpers = require('./helpers');

var app = express();
module.exports.app = app;

app.set('port', 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + './../client/public'))

app.post('/city', function(req, res) {

  var city = req.body.city;

  helpers.getGeoCodes(city)
    .then(function(tuple) {
      return helpers.addLocation(city, tuple)
    })
    .then(helpers.getWeatherData)
    .then(helpers.milesBetween)
    .then(function(tuple) {
      return res.end(tuple);
    });

});

app.listen(app.get('port'));
console.log('Listening on ', app.get('port'));

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
      console.log('TUPLE ', tuple)
      return res.end(tuple);
    });

});


  // geocoder.geocode(city, function(err, data) {
  //   if (err) {
  //     console.log('GeoCode Error: ', err);
  //   }
  //     lat = Math.round(data.results[0].geometry.location.lat);
  //     lon = Math.round(data.results[0].geometry.location.lng);
  //
  //     var options = {
  //       host: 'api.openweathermap.org',
  //       path: '/data/2.5/weather?lat='+lat+'&lon='+lon+'&APPID=5b084e8c99133e1e96cebc07a2d555f7'
  //     };
  //
  //     var body;
  //     console.log(options.path)
  //
  //     http.get(options, function(res1) {
  //       console.log('STATUS: ' + res1.statusCode);
  //       console.log('HEADERS: ' + JSON.stringify(res1.headers));
  //
  //       var chunks = [];
  //
  //       res1.on('data', function(chunk) {
  //         chunks.push(chunk);
  //       }).on('end', function() {
  //         body = Buffer.concat(chunks);
  //         console.log('BODY: ' + body);
  //         res.end(body);
  //       })
  //
  //     });
  // });

  //'api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon
// });



app.listen(app.get('port'));
console.log('Listening on ', app.get('port'));

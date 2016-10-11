var geocoder = require('geocoder');
var Promise = require('bluebird');
var http = require('http');

var locations = [];

Number.prototype.toRad = function() {
  return this * (Math.PI / 180);
};

module.exports.addLocation = function(city, tuple) {
  return new Promise(function(resolve, reject) {
    locations.push({
      city: city,
      coords: tuple
    });
    resolve(tuple);
  });
};

module.exports.milesBetween = function(tuple) {
  return new Promise(function(resolve, reject) {
    var R = 3959; // miles

    var [lat1, lon1] = (locations.length > 1) ? locations[locations.length - 2].coords : tuple[0];
    var [lat2, lon2] = tuple[0];

    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    resolve(JSON.stringify({weather: tuple[1], d: Math.round(R * c)}));
  });
};

module.exports.kelvinToFar = function(kelvin) {
  return kelvin * (9 / 5) - 459.67;
};

module.exports.getGeoCodes = function(city) {
  return new Promise(function(resolve, reject) {
    geocoder.geocode(city, function(err, data) {
      if (err) {
        console.log('GeoCode Error: ', err);
        reject(err);
      } else {
        var lat = Math.round(data.results[0].geometry.location.lat);
        var lon = Math.round(data.results[0].geometry.location.lng);
        resolve([lat, lon]);
      }
    });
  });
};

module.exports.getWeatherData = function(tuple) {
  return new Promise(function(resolve, reject) {
    var options = {
      host: 'api.openweathermap.org',
      path: '/data/2.5/weather?lat='+tuple[0]+'&lon='+tuple[1]+'&APPID=5b084e8c99133e1e96cebc07a2d555f7'
    };

    var body;

    http.get(options, function(res1) {

      var chunks = [];

      res1.on('data', function(chunk) {
        chunks.push(chunk);
      }).on('end', function() {
        body = Buffer.concat(chunks);
        resolve([tuple, String(body)]);
      });
    });
  });
};

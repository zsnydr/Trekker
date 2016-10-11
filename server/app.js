var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
module.exports.app = app;

app.set('port', 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + './../client/public'))


app.post('/city', function(req, res) {

  var lat = Math.round(req.body.lat);
  var lon = Math.round(req.body.lon);

  //'api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon

  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?lat='+lat+'&lon='+lon+'&APPID=5b084e8c99133e1e96cebc07a2d555f7'
  };

  var body;

  http.get(options, function(res1) {
    console.log('STATUS: ' + res1.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res1.headers));

    var chunks = [];

    res1.on('data', function(chunk) {
      chunks.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(chunks);
      console.log('BODY: ' + body);
      res.end(body);
    })

  });
});



app.listen(app.get('port'));
console.log('Listening on ', app.get('port'));

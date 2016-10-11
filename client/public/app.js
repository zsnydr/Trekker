Number.prototype.toRad = function() {
  return this * (Math.PI / 180);
};

var milesBetween = function(firstTuple, secondTuple) {
  var R = 3959; // miles

  var [lat1, lon1] = firstTuple;
  var [lat2, lon2] = secondTuple;

  var dLat = (lat2-lat1).toRad();
  var dLon = (lon2-lon1).toRad();
  var lat1 = lat1.toRad();
  var lat2 = lat2.toRad();

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

var locations = [];
var totalMiles = 0;

$(document).on('ready', function() {

  $("#btn").click(function(){

    var $city1 = $('.city1');
    var geocoder =  new google.maps.Geocoder();
    geocoder.geocode( { 'address': $city1.val()}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var lat = results[0].geometry.location.lat();
        var lon = results[0].geometry.location.lng();

        var temp;

        $.ajax({
          type: 'POST',
          url: 'http://localhost:3000/city',
          data: JSON.stringify({lat: lat, lon: lon}),
          contentType: 'application/json',
          success: function(result) {
            console.log(JSON.parse(result).main.temp*(9/5)-459.67) //convert from K to F
            temp = JSON.parse(result).main.temp*(9/5)-459.67;

            locations.push({city: $city1.val(), lat: lat, lon: lon});

            if (locations.length === 1) {
              var $temp = $('<div class="temp">Current temp: '+ Math.round(temp) + '°F</div>');
              var $loc = $('<div class="loc">' + locations[locations.length-1].city + '</div>');

              var $city = $('<div class="city"></div>')
              $city.append($loc).append($temp)
              $('.itin').append($city);
            }

            if (locations.length > 1) {
              var first = [locations[locations.length - 2].lat, locations[locations.length - 2].lon];
              var second = [locations[locations.length - 1].lat, locations[locations.length - 1].lon];

              var result = Math.round(milesBetween(first, second));

              totalMiles += result;

              $('.total').html('');
              $('.total').append($('<div>Total Miles: ' + totalMiles + '</div>'));

              var $result = $('<div class="miles">' + result + ' miles</div>');
              var $temp = $('<div class="temp">Current temp: '+ Math.round(temp) + '°F</div>');
              var $loc = $('<div class="loc">' + locations[locations.length-1].city + '</div>');

              var $city = $('<div class="city"></div>')
              $city.append($loc).append($temp)

              $('.itin').append($('<div class="arrow">-</div>'));
              $('.itin').append($result);
              $('.itin').append($('<div class="arrow">-</div>'));
              $('.itin').append($('<div class="arrow">></div>'));
              $('.itin').append($city);
            }

            $city1.val('');
          },
          error: function(error) {
            console.log('ERROR ', error);
          }
        });

      } else {
        alert("Something got wrong " + status);
      }
    });

  });

});

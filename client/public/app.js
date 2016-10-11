
var getData = function(city, cb) {

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/city',
    data: JSON.stringify({city: city}),
    contentType: 'application/json',
  })
  .done(function(results) {
    console.log('AJAX RESULTS ', JSON.parse(results));
    cb(JSON.parse(results));
  });
};

$(document).on('ready', function() {

  var totalMiles = 0;
  var first = true;

  $(".new-dest").click(function(){

    var $itin = $('.itin');
    var $dest = $('.dest');

    getData($dest.val(), function(results) {

      var $miles = $('<div class="miles">'+results.d+' miles</div>');

      var $loc = $('<div class="loc">'+$dest.val()+'</div>');
      var $city = $('<div class="city"></div>').append($loc);

      if (!first) {
        $itin.append($miles);
      }

      $itin.append($city);
      $dest.val('');
      first = false;

      totalMiles += Number(results.d);
      $('.total').html('');
      $('.total').append($('<div>Total Miles: ' + totalMiles + '</div>'));

    });
  });
});

















// var geocoder =  new google.maps.Geocoder();
// geocoder.geocode( { 'address': $city1.val()}, function(results, status) {
//   if (status === google.maps.GeocoderStatus.OK) {
//     var lat = results[0].geometry.location.lat();
//     var lon = results[0].geometry.location.lng();
//
//     var temp;
//
//     $.ajax({
//       type: 'POST',
//       url: 'http://localhost:3000/city',
//       data: JSON.stringify({lat: lat, lon: lon}),
//       contentType: 'application/json',
//       success: function(result) {
//         console.log(JSON.parse(result).main.temp*(9/5)-459.67) //convert from K to F
//         temp = JSON.parse(result).main.temp*(9/5)-459.67;
//
//         locations.push({city: $city1.val(), lat: lat, lon: lon});
//
//         if (locations.length === 1) {
//           var $temp = $('<div class="temp">Current temp: '+ Math.round(temp) + '°F</div>');
//           var $loc = $('<div class="loc">' + locations[locations.length-1].city + '</div>');
//
//           var $city = $('<div class="city"></div>')
//           $city.append($loc).append($temp)
//           $('.itin').append($city);
//         }
//
//         if (locations.length > 1) {
//           var first = [locations[locations.length - 2].lat, locations[locations.length - 2].lon];
//           var second = [locations[locations.length - 1].lat, locations[locations.length - 1].lon];
//
//           var result = Math.round(milesBetween(first, second));
//
//           totalMiles += result;
//
//           $('.total').html('');
//           $('.total').append($('<div>Total Miles: ' + totalMiles + '</div>'));
//
//           var $result = $('<div class="miles">' + result + ' miles</div>');
//           var $temp = $('<div class="temp">Current temp: '+ Math.round(temp) + '°F</div>');
//           var $loc = $('<div class="loc">' + locations[locations.length-1].city + '</div>');
//
//           var $city = $('<div class="city"></div>')
//           $city.append($loc).append($temp)
//
//           $('.itin').append($('<div class="arrow">-</div>'));
//           $('.itin').append($result);
//           $('.itin').append($('<div class="arrow">-</div>'));
//           $('.itin').append($('<div class="arrow">></div>'));
//           $('.itin').append($city);
//         }
//
//         $city1.val('');
//       },
//       error: function(error) {
//         console.log('ERROR ', error);
//       }
//     });
//
//   } else {
//     alert("Something got wrong " + status);
//   }
// });

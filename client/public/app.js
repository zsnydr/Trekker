

$(document).on('ready', function() {

  var kelvinToFar = function(kelvin) {
    return Math.round(kelvin * (9 / 5) - 459.67);
  };
  var capString = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  var addCommas = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
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
  var buildDestination = function(results) {

  };

  var totalMiles = 0;
  var first = true;

  $(".new-dest").click(function(){

    var $itin = $('.itin');
    var $dest = $('.dest');

    getData($dest.val(), function(results) {

      var weather = JSON.parse(results.weather);
      var temp = kelvinToFar(weather.main.temp);
      var desc = capString(weather.weather[0].description);

      var $miles = $('<div class="miles">' + addCommas(results.d) + ' miles</div>');

      var $loc = $('<div class="loc">' + $dest.val() + '</div>');
      var $temp = $('<div class="temp">Current temp: ' + temp + '°F</div>');
      var $desc = $('<div class="desc">' + desc + '</div>');
      var $city = $('<div class="city"></div>').append($loc).append($temp).append($desc);

      if (!first) {
        $itin.append($miles);
      }

      $itin.append($city);
      $itin[0].scrollTop = $itin[0].scrollHeight;
      $dest.val('');
      first = false;

      totalMiles += Number(results.d);
      $('.total').html('');
      $('.total').append($('<div>Total Miles: ' + addCommas(totalMiles) + '</div>'));

    });
  });
});

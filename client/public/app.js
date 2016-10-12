
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
      url: '/city',
      data: JSON.stringify({city: city}),
      contentType: 'application/json',
    })
    .done(function(results) {
      console.log('AJAX RESULTS ', JSON.parse(results));
      cb(JSON.parse(results));
    });
  };
  var buildDestination = function(results) {
    var weather = JSON.parse(results.weather);
    var temp = kelvinToFar(weather.main.temp);
    var desc = capString(weather.weather[0].description);
    var $dest = $('.dest');

    var $miles = $('<div class="miles"></div><span>' + addCommas(results.d) + ' miles</span>');

    var $loc = $('<div class="loc">' + $dest.val() + '</div>');
    var $temp = $('<div class="temp">Current temp: ' + temp + '°F</div>');
    var $desc = $('<div class="desc">' + desc + '</div>');
    var $city = $('<div class="city"></div>').append($loc).append($temp).append($desc);

    if (!first) {
      $itin.append($miles);
      totalMiles += Number(results.d);
      $('.total').html('');
      $('.total').append($('<div>Total Miles: ' + addCommas(totalMiles) + '</div>'));
    }

    $itin.append($city);
    $itin[0].scrollTop = $itin[0].scrollHeight;
    $dest.val('');
    first = false;

  };

  var totalMiles = 0;
  var first = true;
  var $itin = $('.itin');

  $(".new-dest").click(function() {
    getData($('.dest').val(), function(results) {
      buildDestination(results);
    });
  });

  $(".clear-all").click(function() {
    $itin.html('');
    first = true;
    totalMiles = 0;
    $('.total').html('');
    $('.total').append($('<div>Total Miles: ' + addCommas(totalMiles) + '</div>'));
  });

});

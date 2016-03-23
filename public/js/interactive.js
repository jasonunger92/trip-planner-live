$(function() {
    initialize_gmaps();
    var days = [{ hotels: [], restaurants: [], activities: [], markers: [] }];
    var icons = {
      hotels: '/images/lodging_0star.png',
      restaurants: '/images/restaurant.png',
      activities: '/images/star-3.png'
    };

    $('#selectors').on('click', 'button', function() {
        var text = $(this).parent().children('select').children('option:selected').text();
        var category = $(this).parent().attr('class');
        var index = parseInt($('.current-day').text()) - 1;
        if (category === 'hotels' && days[index].hotels.length === 1) {
            return;
        }
        if (category === 'restaurants' && days[index].restaurants.length === 3) {
            return;
        }
        if (days[index][category].indexOf(text) > -1) {
            return;
        }
        $('.itinerary').find('.' + category).children('ul').append('<div class="itinerary-item"><span class="title">' + text + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
        addToDay(index, category, text);
        var location = days[index][category][days[index][category].length-1].place.location;
        var marker = drawLocation(location,{
          icon: icons[category]
        });
        marker.name = text;
        days[index].markers.push(marker);
        updateMap(days[index].markers);
    });

    $('.itinerary').on('click', '.remove', function() {
        var item = $(this).prev().text();
        var category = $(this).parent().parent().parent().attr('class');
        var index = parseInt($('.current-day').text()) - 1;
        removeFromDay(index, category, item);
        var marker = days[index].markers.filter(function(marker) {
          return marker.name === item;
        })[0];
        marker.setMap(null);
        var idx = days[index].markers.indexOf(marker);
        days[index].markers.splice(idx,1);
        if (days[index].markers.length > 0) {
          updateMap(days[index].markers);
        } else {
          initialize_gmaps();
        }
        $(this).parent().remove();
    });

    $('#addDay').on('click', function() {
        var nextDay = parseInt($(this).prev().text()) + 1;
        days.push({ hotels: [], restaurants: [], activities: [], markers: [] });
        $(this).siblings('.current-day').removeClass('current-day');
        $(this).before('<button class="btn btn-circle day-btn day current-day">' + nextDay + '</button>\n');
        $('#day-title').children('span').text('Day ' + nextDay);
        populate(nextDay - 1);
    });

    $('.day-buttons').on('click', '.day', function() {
      var idx = parseInt($(this).siblings('.current-day').text())-1;
      clearMap(days[idx].markers);
        $(this).siblings('.current-day').removeClass('current-day');
        $(this).addClass('current-day');
        $('#day-title').children('span').text('Day ' + $(this).text());
        var index = parseInt($('.current-day').text()) - 1;
        populate(index);
    });

    $('#day-title .remove').on('click', function() {
        if ($('.current-day').text() === '1' && days.length === 1) {
            return;
        } else if ($('.current-day').next().text() === '+') {
            var dayMarkers = days.pop().markers;
            clearMap(dayMarkers);
            $('.current-day').remove();
            $('#addDay').prev().addClass('current-day');
            $(this).prev().text('Day ' + $('.current-day').text());
            var index = parseInt($('.current-day').text()) - 1;
            populate(index);
        } else {
            var index = parseInt($('.current-day').text()) - 1;
            var dayMarkers = days.splice(index, 1)[0].markers;
            clearMap(dayMarkers);
            $('#addDay').prev().remove();
            populate(index);
        }
    });

    function addToDay(index, category, text) {
        var obj = refObj[category].filter(function(elem) {
            return elem.name === text;
        })[0];
        days[index][category].push(obj);
        console.log(days[index], index);
    }

    function removeFromDay(index, category, text) {
        var obj = days[index][category].filter(function(elem) {
            return elem.name === text;
        })[0];
        var idx = days[index][category].indexOf(obj);
        days[index][category].splice(idx, 1);
        console.log(days[index], index);
    }

    function populate(index) {
        var extended = false;
        for (var key in days[index]) {
            $('.itinerary').find('.' + key).children('ul').children().remove();
            days[index][key].forEach(function(elem) {
                extended = true;
                $('.itinerary').find('.' + key).children('ul').append('<div class="itinerary-item"><span class="title">' + elem.name + '</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
            });
        }
        if (extended) {
          updateMap(days[index].markers);
        } else {
          initialize_gmaps();
        }
    }

    function updateMap (markerArray) {
      var bounds = new google.maps.LatLngBounds();
      markerArray.forEach(function (marker) {
        marker.setMap(map);
        bounds.extend(marker.position);
      });
      map.fitBounds(bounds);
    }

    function clearMap (markerArray) {
      markerArray.forEach(function(marker) {
        marker.setMap(null);
      });
    }

});
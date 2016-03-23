$(function () {
  var days = [{hotel: [], restaurant: [], activity: []}];
  
  $('#selectors').on('click','button',function () {
    var text = $(this).parent().children('select').children('option:selected').text();
    var category = $(this).parent().attr('class');
    var index = parseInt($('.current-day').text())-1;
    $('.itinerary').find('.'+category).children('ul').append('<div class="itinerary-item"><span class="title">'+text+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
    // console.log('Added ',text,' to ',category,' at index ',index,' in days');
    addToDay(index,category,text);
  });

  $('.itinerary').on('click','.remove',function () {
    $(this).parent().remove();
  });

  $('#addDay').on('click',function () {
    var nextDay = parseInt($(this).prev().text())+1;
    days.push({hotel: [], restaurant: [], activity: []});
    $(this).siblings('.current-day').removeClass('current-day');
    $(this).before('<button class="btn btn-circle day-btn day current-day">'+nextDay+'</button>\n');
    $('#day-title').children('span').text('Day '+nextDay);
  });

  $('.day-buttons').on('click','.day',function () {
    $(this).siblings('.current-day').removeClass('current-day');
    $(this).addClass('current-day');
    $('#day-title').children('span').text('Day '+$(this).text());
  });

  $('#day-title .remove').on('click', function() {
    if ($('.current-day').text() === '1' && days.length === 1) {
      return;
    } else if ($('.current-day').next().text() === '+') {
      days.pop();
      $('.current-day').remove();
      $('#addDay').prev().addClass('current-day');
      $(this).prev().text('Day '+$('.current-day').text());
    } else {
      var index = parseInt($('.current-day').text())-1;
      days.splice(index,1);
      $('#addDay').prev().remove();
    }
  });

  function addToDay (index,category,text) {
    days[index][category].push(text);
    console.log(days);
    console.log(days[index],index);
  }

  function populate (index) {
    for (var key in days[index]) {
      days[index].key.forEach(function(elem) {
        $('.itinerary').find('.'+key).children('ul').append('<div class="itinerary-item"><span class="title">'+elem+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
      });
    }
  }
});


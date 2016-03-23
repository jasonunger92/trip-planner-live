$(function () {
  var days = [{hotel: [], restaurants: [], activities: []}];
  $('#selectors').on('click','button',function () {
    var text = $(this).parent().children('select').children('option:selected').text();
    var category = $(this).parent().attr('class');
    $('.itinerary').find('.'+category).children('ul').append('<div class="itinerary-item"><span class="title">'+text+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
  });

  $('.itinerary').on('click','.remove',function () {
    $(this).parent().remove();
  });

  $('#addDay').on('click',function () {
    var nextDay = parseInt($(this).prev().text())+1;
    days.push({hotel: [], restaurants: [], activities: []});
    $(this).siblings('.current-day').removeClass('current-day');
    $(this).before('<button class="btn btn-circle day-btn day current-day">'+nextDay+'</button>\n');
    $('#day-title').children('span').text('Day '+nextDay);
  });

  $('.day-buttons').on('click','.day',function () {
    $(this).siblings('.current-day').removeClass('current-day');
    $(this).addClass('current-day');
    $('#day-title').children('span').text('Day '+$(this).text());
  });
});
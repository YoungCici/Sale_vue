import $ from 'jquery'

$(window).on('resize', function () {
  $('html').css('fontSize', $(window).width() / 3.75)
}).resize()

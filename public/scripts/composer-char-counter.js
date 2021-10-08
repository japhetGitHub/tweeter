$(document).ready(function() {
  $('#tweet-text').on('keyup', function() {
    const count = 140 - $(this).val().length;
    if (count < 0 && !$(this).siblings('div').children('output').hasClass('counter-red')) {
      $(this).siblings('div').children('output').addClass('counter-red')
      // $(this).siblings('div').children('output').css('color', 'red');      
    } 
    if (count >= 0) {
      $(this).siblings('div').children('output').removeClass('counter-red')
    }
    
    $(this).siblings('div').children('output').val(count);
  });
});
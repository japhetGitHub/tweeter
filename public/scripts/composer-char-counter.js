$(document).ready(function() {
  $('#tweet-text').on('keyup', function() { // 'keyup' listener chosen over keypress because keypress lags 1 character behind
    const count = 140 - $(this).val().length; // measuring textarea input length
    if (count < 0 && !$(this).siblings('div').children('output').hasClass('counter-red')) { // applies negative counter style
      $(this).siblings('div').children('output').addClass('counter-red');
    }
    if (count >= 0) {
      $(this).siblings('div').children('output').removeClass('counter-red');
    }
    
    $(this).siblings('div').children('output').val(count); // updates counter displayed value
  });
});
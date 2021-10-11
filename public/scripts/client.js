/*
 * Client-side JS logic
 * jQuery is already loaded
 */

const escape = function(str) { // to prevent XSS attacks the input is santized here 
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function(tweetData) { // tweetData comes from a server call in loadTweets()
  return `
    <article class="tweet">
      <header>
        <span>
            <img src="${tweetData.user.avatars}" alt="">
          ${tweetData.user.name}
        </span>
        ${tweetData.user.handle}
      </header>
      <p>
        ${escape(tweetData.content.text)}
      </p>
      <footer>
        ${timeago.format(tweetData.created_at)}
        <span>
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </span>
      </footer>
    </article>
  `;
};

const renderTweets = function(tweets) {
  $('#tweets-container').empty(); // clears the tweets <section> before reloading the tweets
  return tweets.forEach(tweetData => {
    const $tweet = createTweetElement(tweetData);
    $('#tweets-container').prepend($tweet); // prepend() makes the tweets display in reverse-chronological order
  });
};

const loadTweets = function() { // loads all tweets retreived from server
  $.get('/tweets', function(tweetData) {
    renderTweets(tweetData);
  }, 'json');
};

$(document).ready(function() {

  $('#btn-goto-top').click(function(event) {
    event.preventDefault();
    $('html, body').animate({ scrollTop: '0'});

    // after scroll animation finishes, reveal (slide down) new tweet form every time
    $('.new-tweet').slideDown('slow', function() {
      $('#tweet-text').focus();
    });
    if ($('.new-tweet').is(':visible')) {
      $('.new-tweet').css('display', 'flex');
    }

    // applies css class which rotates the new tweet nav button 180deg
    $('#btn-nav-new-tweet i').addClass('up');
  });
  
  $('#btn-nav-new-tweet').click(function(event) {
    event.preventDefault();

    // when new tweet nav button is pressed the new tweet form is toggled into/out-of view
    $('.new-tweet').slideToggle('slow', function() {
      $('#tweet-text').focus();
    });
    if ($('.new-tweet').is(':visible')) {
      $('.new-tweet').css('display', 'flex');
    }

    $('#btn-nav-new-tweet i').toggleClass('up');
  });

  $(window).scroll(function() {
    if ($(window).scrollTop() > ($('header').height() - $('nav').height())) { // upon scrolling ...
      $('nav').addClass('solidify'); // apply class to nav which changes background color from transparent to blue
      $('#btn-goto-top').show(); // reveal 'scroll to top' button
      $('#btn-nav-new-tweet').hide(); // hide new tweet form button (because scroll to top button reveals tweet form when pressed)
    } else {
      $('nav').removeClass('solidify');
      $('#btn-goto-top').hide();
      $('#btn-nav-new-tweet').show();
    }
  });

  $('.new-tweet > form').submit(function(event) {
    event.preventDefault();

    const errElem = $(this).siblings('label'); // referencing the (default) hidden element which displays tweet form errors
    if (!errElem.hasClass('hidden')) {
      errElem.slideUp('slow', function() { // upon submitting new tweet if error label is visible, hide it before validating new input 
        errElem.addClass('hidden');
      });
    }

    const formText = $(this).serializeArray()[0].value; // retrieves textarea form input

    if (formText && formText.length <= 140) { // valid input (checking if there is either 0 or >140 characters)
      const $this = $(this); // caching the form context to use in post success f'n

      $.post('/tweets', $(this).serialize(), function() {
        // clearing the form
        $('#tweet-text').val('');
        $this.find('output').text('140');

        //reloads tweets including latest tweet
        loadTweets(); // reloading all tweets upon each submit ensures that the timestamps displayed for each tweet are updated
      });
    } else {
      errElem.slideToggle({ // will always slide down but slideToggle offers slideToggle([..options]) fn with more control
        duration: 'slow',
        start: function() { // sets the error message before displaying the element so user doesn't see the value change
          formText ? errElem.find('p').text('Tweet is too long (>140 characters)') : errElem.find('p').text('Empty Tweet');
        },
        complete: function() { // once slide animation is complete
          errElem.removeClass('hidden');
        }
      });
    }
  });

  loadTweets(); // ensures all tweets from server are loaded up upon page load
});
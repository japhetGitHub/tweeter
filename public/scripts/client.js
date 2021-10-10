/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function (tweetData) {
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

const renderTweets = function (tweets) {
  return tweets.forEach(tweetData => {
    const $tweet = createTweetElement(tweetData);
    $('#tweets-container').prepend($tweet);
  });
};

const loadTweets = function() {
  $.get('/tweets', function(data) {
    renderTweets(data);
  }, 'json');
};

$(document).ready(function () {


  $('#btn-nav-new-tweet').click(function() {
    $('.new-tweet').slideToggle('slow', function() {
      $('#tweet-text').focus();
    });
    if ($('.new-tweet').is(':visible')) {
      $('.new-tweet').css('display', 'flex');
    }
  });

  $(window).scroll(function() {
    if ($(window).scrollTop() > ($('header').height() - $('nav').height())) {
      $('nav').addClass('solidify');
    } else {
      $('nav').removeClass('solidify');
    }
  });

  $('.new-tweet > form').submit(function (event) {
    event.preventDefault();

    const errElem = $(this).siblings('label');
    if (!errElem.hasClass('hidden')) {
      errElem.slideUp('slow', function() {
        errElem.addClass('hidden');
      });
    }

    const formText = $(this).serializeArray()[0].value;

    if (formText && formText.length <= 140) { // valid input
      const $this = $(this); // caching the form context to use in post success f'n

      $.post('/tweets', $(this).serialize(), function() {
        // clearing the form
        $('#tweet-text').val('');
        $this.find('output').text('140');

        //reload tweets (including newest addition)
        loadTweets();
      });
    } else {
        errElem.slideToggle({
          duration: 'slow',
          start: function() {
            formText ? errElem.find('p').text('Tweet is too long (>140 characters)') : errElem.find('p').text('Empty Tweet');
          },
          complete: function() {
            errElem.removeClass('hidden');
          }
        });
    }
  });

  loadTweets();
});
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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
        ${tweetData.content.text}
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

$(document).ready(function () {
  $(function loadTweets() {
    $.get('/tweets', function(data) {
      renderTweets(data);
    }, 'json');
  });

  $('.new-tweet > form').submit(function (event) {
    const formText = $(this).serializeArray()[0].value;
    if (formText && formText.length <= 140) { // valid input
      const $this = $(this); // caching 'this' to reference within $.post
      $.post('/tweets', $(this).serialize(), function() {
        // clears the form
        // $this.trigger('reset');
        
        // prefered solution for clearing the form (per code review)
        $('#tweet-text').val('');
        $('.counter').text('140'); 
      });
    } else {
      formText ? alert('Tweet is too long (>140).') : alert('Tweet Content not present.');
    }
    event.preventDefault();
  });

});
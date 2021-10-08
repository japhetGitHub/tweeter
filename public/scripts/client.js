/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];

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
    $('#tweets-container').append($tweet);
  });
};

$(document).ready(function () {
  $('.new-tweet > form').submit(function(event) {
    // console.log($(this).serialize());
    $.post('/tweets', $(this).serialize());
    event.preventDefault();
  });
  renderTweets(data);
});
var suggestionsView;

DZ.init({
  appId: '164985',
  channelUrl: 'http://enjikaka.github.com/deezer-assignment/channel.html'
});

/*
DZ.init({
  appId: '164935',
  channelUrl: 'http://localhost:3000/channel.html'
});
*/

DZ.login(function(response) {
  window.token = response.authResponse.accessToken;
  
  DZ.api('/user/me', function(response) {
    suggestionsView = new SuggestionsView({model: new Suggestion()});
  });
});
var suggestionsView;

var appIdLocal = '164935';

DZ.init({
  appId: appIdLocal,
  channelUrl: 'http://localhost:3000/channel.html'
});

DZ.login(function(response) {
  window.token = response.authResponse.accessToken;
  DZ.api('/user/me', function(response) {
    
    suggestionsView = new SuggestionsView({model: new Suggestion()});
  });
});
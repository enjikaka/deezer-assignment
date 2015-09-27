var suggestionsView;

var appIdDev = '164935';
var appIdProd = '164985';

DZ.init({
  appId: appIdProd,
  channelUrl: 'http://enjikaka.github.com/deezer-assignment/channel.html'
});

DZ.login(function(response) {
  window.token = response.authResponse.accessToken;
  DZ.api('/user/me', function(response) {
    
    suggestionsView = new SuggestionsView({model: new Suggestion()});
  });
});
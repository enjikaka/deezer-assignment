/*DZ.init({
  appId: '164985',
  channelUrl: 'http://enjikaka.github.com/deezer-assignment/channel.html'
});


DZ.init({
  appId: '164935',
  channelUrl: 'http://localhost:3000/channel.html'
});*/

// Login stuff. Was not needed after all...
/*DZ.login(function(response) {
  App.tmp.token = response.authResponse.accessToken;
  
  DZ.api('/user/me', function(response) {
    
  });
});*/

App.Instance.suggestionsView = new App.View.Suggestions({model: new App.Model.Suggestion()});
Backbone.history.start();
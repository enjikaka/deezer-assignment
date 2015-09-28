/*
  
  Handles listing tracks for an album

*/

App.Model.Track = Backbone.Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null,
    position: null,
    duration: null,
    preview: null
  }
});

App.Collection.Track = Backbone.Collection.extend({
  model: App.Model.Track,
  initialize: function(data, settings) {
    this.push(data);
  }
});

App.View.TrackList = Backbone.View.extend({
  el: '#track-list',
  events: {
    'click button[data-play]': 'togglePlay',
    'click #history-back': 'goBack'
  },
  initialize: function(viewData) {
    this.audio = document.createElement('audio');

    this.viewData = viewData;
    this.render();
  },
  render: function() {
    // Fetch template from DOM
    var template = _.template($('#tracklist-template').html());
    // Render the template with data from viewData to this Views' element
    this.$el.html(template(this.viewData));

    // Add the class "show" to this Views' element
    this.$el.addClass('show');

    // Make the browser jump to the now visible trackview when it is out of the viewport
    //document.location.hash = '';
    //document.location.hash = '#track-list';
  },
  goBack: function(event) {
    this.audio.pause();
    window.history.back();
  },
  togglePlay: function(event) {
    var button = event.target;
    var audio = this.audio;
    var icon;

    if (audio.src !== event.target.dataset.play) {
      audio.src = event.target.dataset.play;
      audio.play();
    } else {
      audio.paused ? audio.play() : audio.pause();
    }

    icon = audio.paused ? 'play_arrow' : 'pause';
    event.target.innerHTML = icon;
  }
});
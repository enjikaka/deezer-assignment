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
  url: function() {
    return this.albumId;
  },
  sync: function(method, model) {
    var self = this;

    DZ.api('/album/' + self.albumId + '/tracks', function(response) {
      self.parse(response);
    });
  }, 
  initialize: function(data, settings) {
    var self = this;
    self.albumId = settings.albumId;
  },
  parse: function(response) {
    var self = this;

    $.map(response.data, function(item) {
      var track = new App.Model.Track();

      track.id = item.id;
      track.name = item.title;
      track.position = item.track_position;
      track.duration = App.Util.formatTime(item.duration);
      track.preview = item.preview;

      self.push(track);
    });

    return this.models;
  }
});

App.View.TrackList = Backbone.View.extend({
  el: '#track-list',
  events: {
    'click button[data-play]': 'togglePlay',
    'click #history-back': 'goBack'
  },
  initialize: function(settings) {
    var self = this;

    this.audio = $('#audio')[0];
    this.settings = settings || {};
    this.collection = this.settings.collection;
    this.collection.fetch();

    var albumName;
    var albumCover;
    var albumReleased;

    $('.search-results').removeClass('show');

    // Fetch information about the album to get the release year
    DZ.api('/album/' + settings.albumId, function(response) {
      
      albumName = response.title;
      albumCover = response.cover_medium;
      albumReleased = response.release_date.split('-')[0];
      self.artist = response.artist.id;

      var viewData = {
        albumReleased: albumReleased,
        albumName: albumName,
        albumCover: albumCover,
        tracks: self.collection
      };
      
      self.render(viewData);
    });
  },
  render: function(viewData) {
    console.log(viewData);

    // Fetch template from DOM
    var template = _.template($('#tracklist-template').html());

    // Render the template with data from viewData to this Views' element
    this.$el.html(template(viewData));

    // Add the class "show" to this Views' element
    this.$el.addClass('show');
  },
  goBack: function(event) {
    this.audio.pause();
    window.history.back();
  },
  loadAndPlay: function(src, target) {
    var audio = this.audio;
    audio.src = src;
    target.innerHTML = 'pause';
    App.tmp.lastTarget = target;
  },
  togglePlay: function(event) {
    var button = event.target;
    var audio = this.audio;
    var src = event.target.dataset.play;
    var icon;

    if (App.tmp.lastTarget && App.tmp.lastTarget !== event.target) {
      App.tmp.lastTarget.innerHTML = 'play_arrow';
    }

    if (!audio.paused) {
      audio.pause();
      App.tmp.lastTarget.innerHTML = 'play_arrow';
      if (App.tmp.lastTarget !== event.target) {
        this.loadAndPlay(src, event.target);
      }
    }
    else {
      this.loadAndPlay(src, event.target);
      App.tmp.lastTarget = event.target;
      event.target.innerHTML = 'pause';
    }
  }
});
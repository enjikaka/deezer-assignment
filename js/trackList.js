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
  },
  name: function() {
    return this.get('name');
  },
  position: function() {
    return this.get('position');
  },
  duration: function() {
    return this.get('duration');
  },
  preview: function() {
    return this.get('preview');
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
    var track = {};
    var self = this;

    $.map(response.data, function(item) {
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
    'click button[data-preview]': 'togglePlay'
  },
  initialize: function(settings) {
    var self = this;

    this.settings = settings || {};
    this.collection = this.settings.collection;
    this.collection.fetch();

    this.collection.bind('add', function() {
      var albumName;
      var albumCover;
      var albumReleased;

      $('.search-results').removeClass('show');

      // Fetch information about the album to get the release year
      DZ.api('/album/' + settings.albumId, function(response) {
        
        albumName = response.title;
        albumCover = response.cover_medium;
        albumReleased = response.release_date.split('-')[0];

        var viewData = {
          albumReleased: albumReleased,
          albumName: albumName,
          albumCover: albumCover,
          tracks: self.collection.toJSON()
        };
        
        self.render(viewData);
      });
    });
  },
  render: function(viewData) {
    // Fetch template from DOM
    var template = _.template($('#tracklist-template').html());

    // Render the template with data from viewData to this Views' element
    this.$el.html(template(viewData));

    // Add the class "show" to this Views' element
    this.$el.addClass('show');
  },
  pauseAllAudios: function() {
    $('audio').each(function(event) {
      $(this)[0].pause();
    });
  },
  audioPause: function(event) {
    var audio = $(event.target);
    var button = $(event.target).siblings();
    button.html('play_arrow');
  },
  audioStart: function(event) {
    var audio = $(event.target);
    var button = $(event.target).siblings();
    button.html('pause');
  },
  togglePlay: function(event) {
    var button = $(event.target);
    var audio = $(event.target).siblings();
    button.html('cached');
    if (audio[0].paused) {
      this.pauseAllAudios();
      audio[0].src = button[0].dataset.preview;
    } else {
      audio[0].pause();
    }
    audio.on('pause', this.audioPause);
    audio.on('ended', this.audioPause);
    audio.on('playing', this.audioStart);
  }
});
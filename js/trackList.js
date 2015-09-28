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
  initialize: function(settings) {
    var self = this;

    this.settings = settings || {};
    this.audio = $('#audio')[0];
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

    // Add clickevents to the buttons
    // The events property on App.View.TrackList 
    // did not work properly
    this.registerClickEvents();
  },
  registerClickEvents: function() {
    var self = this;
    $('#track-list button[data-preview]').each(function() {
      $(this).on('click', self.togglePlay);
    });
  },
  pauseAudio: function() {
    this.audio.pause();
    $('#track-list button[data-preview]').each(function() {
      if (!$(this).attr('disabled')) {
        $(this).html('play_arrow');
      }
    });
  },
  togglePlay: function(event) {
    var self = App.Instance.trackListView;

    var button = $(event.target);
    var audio = self.audio;

    var src = button[0].dataset.preview;
    
    button.html('cached');

    // If we did not click an already "playing button"
    // then pause the audio and load the new MP3
    if (audio.src !== src) {
      self.pauseAudio();
      audio.src = src;
      button.html('pause');

      // If the audio preview cannot load, then display error
      // and diasable to button
      $(audio).on('error', function() {
        button.html('error_outline');
        button.attr('disabled', 'true');
      });
    } else {
      // Remove the error listener, we have a new button now!
      $(audio).off('error');

      if (audio.paused) {
        audio.play();
        button.html('pause');
      } else {
        audio.pause();
        button.html('play_arrow');
      }
    }
  }
});
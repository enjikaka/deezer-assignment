/*

  Handles listing tracks for an album

*/

import { formatTime } from './utils.js';

export const TrackModel = Backbone.Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null,
    position: null,
    duration: null,
    preview: null
  }
});

function parseDeezerTracksResponse (response) {
  return response.data.map(item => {
    const track = {};

    track.id = item.id;
    track.name = item.title;
    track.position = item.track_position;
    track.duration = formatTime(item.duration);
    track.preview = item.preview;

    return track;
  });
}

export const TrackCollection = Backbone.Collection.extend({
  model: TrackModel,
  url: function() {
    return this.albumId;
  },
  sync: function() {
    DZ.api('/album/' + this.albumId + '/tracks', response => this.push(parseDeezerTracksResponse(response)));
  },
  initialize: function(_, settings) {
    this.albumId = settings.albumId;
  }
});

export const TrackListView = Backbone.View.extend({
  el: '#track-list',
  initialize: function(settings) {
    var self = this;

    this.settings = settings || {};
    this.audio = $('#audio')[0];
    this.collection = this.settings.collection;
    this.collection.fetch();

    this.collection.bind('add', function() {
      $('.search-results').removeClass('show');

      // Fetch information about the album to get the release year
      DZ.api('/album/' + settings.albumId, function(response) {
        const albumName = response.title;
        const albumCover = response.cover_medium;
        const albumReleased = response.release_date.split('-')[0];

        const viewData = {
          albumReleased,
          albumName,
          albumCover,
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
    var trackListViewInstance = this;

    $('#track-list button[data-preview]').each(function() {
      $(this).on('click', event => trackListViewInstance.togglePlay(event));
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
  togglePlay: function (event) {
    var button = $(event.target);
    var audio = this.audio;

    var src = button[0].dataset.preview;

    button.html('cached');

    // If we did not click an already "playing button"
    // then pause the audio and load the new MP3
    if (audio.src !== src) {
      this.pauseAudio();
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
/*
  
  Handles listing albums

*/

var albumListView, trackListView, trackCollection;
_.templateSettings.variable = 'gs'; // global scope

var Album = Backbone.Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null,
    cover: null
  },
  name: function() {
    return this.get('name');
  },
  cover: function() {
    return this.get('cover');
  }
});

var AlbumCollection = Backbone.Collection.extend({
  model: Album,
  url: function() {
    return this.artistId;
  },
  sync: function(method, model) {
    var self = this;

    DZ.api('/artist/' + model.artistId + '/albums', function(response) {
      self.parse(response);
    });
  },            
  initialize: function(data, settings) {
    this.artistId = settings.artistId;
  },
  parse: function(response) {
    var album = {};  
    var self = this;

    if (response.data.length < 1) {
      alert('No albums found.');
      return;
    }

    $.map(response.data, function(item) {
      album.id = item.id;
      album.name = item.title;
      album.cover = item.cover_medium;
      album.tracks = [];

      self.push(album);
    });

    return this.models;
  }
});

var AlbumView = Backbone.View.extend({
  tagName: 'figure',
  events: {
    'click': 'viewTrackList'
  },
  renderTrackList: function(trackList) {
    // Get some album information to display in the view
    var albumName = this.model.toJSON().name;
    var albumCover = this.model.toJSON().cover;
    var albumReleased = this.model.toJSON().released;

    // Create an object to put in the template
    // Create collection of Track Models
    var viewData = {
      album_name: albumName,
      album_cover: albumCover,
      album_released: albumReleased,
      tracks: new TrackCollection(trackList)
    };

    // Load the view
    trackListView = new TrackListView(viewData);
  },
  formatTime: function(seconds) {
    // seconds -> MM:SS

    var date = new Date(1970,0,1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
  },
  viewTrackList: function() {
    var albumId = this.model.attributes.id;
    var self = this;

    var albumReleased = null;

    // Fetch information about the album to get the release year
    DZ.api('/album/' + albumId, function(albumResponse) {
      albumReleased = albumResponse.release_date.split('-')[0];

      // Fetch tracks on the album
      DZ.api('/album/' + albumId + '/tracks', function(trackResponse) {
        var trackList = [];

        // Loop through the respons
        _.forEach(trackResponse.data, function(item) {
          // Create a new istance of a Track Model.
          var track = new Track();

          track.id = item.id;
          track.name = item.title;
          track.position = item.track_position;
          track.duration = self.formatTime(item.duration);
          track.released = albumReleased;
          track.preview = item.preview;

          // Push the model to an array
          trackList.push(track);
        });

        // Send the array to a function to prepare it before putting it in the view
        self.renderTrackList(trackList);
      });
    });
  },
  template: _.template('<img src="<%= gs.cover %>" alt="<%= gs.name %>"><figcaption><%= gs.name %></figcaption>'),
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.attr('value', this.model.toJSON().name);
    this.$el.attr('label', this.model.toJSON().id);
    return this;
  }
});

var AlbumListView = Backbone.View.extend({
  el: '#albums',
  initialize: function(options) {
    var self = this;
    this.options = options || {};
    this.collection = this.options.collection;
    this.collection.fetch();
    this.collection.bind('add', function() {
      self.render();
      $('.search-results').addClass('show');
    });
  },
  render: function() {
    this.$el.html('');

    this.$el.className = 'album';

    this.collection.each(function(album) {
      var albumView = new AlbumView({ model: album });
      this.$el.append(albumView.render().el);
    }, this);

    return this;
  }
});


function getArtistIdFromName(name) {
  return $('#search option[value="'+name+'"]').attr('label');
}

function searchButtonClick() {
  var artistName = $('#search input').val();
  var artistId = getArtistIdFromName(artistName);
  $('.search-results').removeClass('show');

  if (!artistId) {
    return;
  }
  
  console.debug('Fetching albums from artist #' + artistId + ' ('+artistName+')');
  
  albumListView = new AlbumListView({
    collection: new AlbumCollection([], {
      artistId: artistId
    })
  });

  $('.search-results h2').text('Albums from ' + artistName);
}

$('#search button').on('click', searchButtonClick);
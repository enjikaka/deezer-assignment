App.Router.Default = Backbone.Router.extend({
	routes: {
    'artist/:id': 'getAlbums',
    'album/:id': 'getAlbum',
    '*actions': 'defaultRoute'
  }
});

App.Instance.appRouter = new App.Router.Default();

App.Instance.appRouter.on('route:getAlbums', function(artistId) {
  App.Instance.albumListView = new App.View.AlbumList({
    collection: new App.Collection.Album([], {
      artistId: artistId
    })
  });
});

App.Instance.appRouter.on('route:getAlbum', function(albumId) {
    var self = this;
    var albumName;
    var albumCover;
    var albumReleased;

    $('.search-results').removeClass('show');

    // Fetch information about the album to get the release year
    DZ.api('/album/' + albumId, function(albumResponse) {
      albumReleased = albumResponse.release_date.split('-')[0];
      albumName = albumResponse.title;
      albumCover = albumResponse.cover_medium;

      // Fetch tracks on the album
      DZ.api('/album/' + albumId + '/tracks', function(trackResponse) {
        var trackList = [];

        // Loop through the respons
        _.forEach(trackResponse.data, function(item) {
          // Create a new istance of a Track Model.
          var track = new App.Model.Track();

          track.id = item.id;
          track.name = item.title;
          track.position = item.track_position;
          track.duration = App.Util.formatTime(item.duration);
          track.released = albumReleased;
          track.preview = item.preview;

          // Push the model to an array
          trackList.push(track);
        });

        trackList = new App.Collection.Track(trackList);

        // Create an object to put in the template
        // Create collection of Track Models
        var viewData = {
          albumName: albumName,
          albumCover: albumCover,
          albumReleased: albumReleased,
          tracks: trackList
        };

        // Load the view
        App.Instance.trackList = new App.View.TrackList(viewData);
      });
    });
});

App.Instance.appRouter.on('route:defaultRoute', function(actions) {
  console.log(actions);
})
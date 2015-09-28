App.Router.Default = Backbone.Router.extend({
	routes: {
    'artist/:id': 'getAlbums',
    'album/:id': 'getAlbum'
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
  App.Instance.trackListView = new App.View.TrackList({
    collection: new App.Collection.Track([], {
      albumId: albumId
    }),
    albumId: albumId
  });
});
import App from './app.js';

export const AppRouter = Backbone.Router.extend({
	routes: {
    'artist/:id': 'getAlbums',
    'album/:id': 'getAlbum'
  }
});

let router = new AppRouter();

router.on('route:getAlbums', artistId => new App.View.AlbumList({
  collection: new App.Collection.Album([], {
    artistId
  })
}));

router.on('route:getAlbum', albumId => new App.View.TrackList({
  collection: new App.Collection.Track([], {
    albumId
  }),
  albumId
}));

export default router;
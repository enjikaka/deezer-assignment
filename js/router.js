import { Router } from './backbone.js';

import AlbumCollection from './collections/album.js';
import AlbumListView from './views/albumList.js';

import TrackCollection from './collections/track.js';
import TrackListView from './views/trackList.js';

export const AppRouter = Router.extend({
	routes: {
    'artist/:id': 'getAlbums',
    'album/:id': 'getAlbum'
  }
});

let router = new AppRouter();

router.on('route:getAlbums', artistId => new AlbumListView({
  collection: new AlbumCollection([], {
    artistId
  })
}));

router.on('route:getAlbum', albumId => new TrackListView({
  collection: new TrackCollection([], {
    albumId
  }),
  albumId
}));

export default router;
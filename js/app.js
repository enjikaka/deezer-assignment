import { AlbumModel, AlbumCollection, AlbumView, AlbumListView } from './albumList.js';
import { TrackModel, TrackCollection, TrackListView } from './trackList.js';

const App = {
	Model: {
		Album: AlbumModel,
		Track: TrackModel,
	},
	View: {
		Album: AlbumView,
		AlbumList: AlbumListView,
		TrackList: TrackListView,
	},
	Collection: {
		Album: AlbumCollection,
		Track: TrackCollection,
	},
	Instance: {},
	tmp: {}
};

export let currentTrackListView = undefined;

export function setCurrentTrackListView (trackListView) {
	currentTrackListView = trackListView;
}

export default App;

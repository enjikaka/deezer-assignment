import { Collection } from '../backbone.js';
import TrackModel from '../models/track.js';
import { formatTime } from '../utils.js';

function parseDeezerTracksResponse(response) {
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

export default class TrackCollection extends Collection {
  model = TrackModel;

  constructor(models, { albumId }) {
    super();

    this.albumId = albumId;
  }

  url () {
    return this.albumId;
  }

  sync () {
    DZ.api(
      '/album/' + this.albumId + '/tracks',
      response => this.push(parseDeezerTracksResponse(response))
    );
  }
}

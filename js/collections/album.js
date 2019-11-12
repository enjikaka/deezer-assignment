import { Collection } from '../backbone.js';
import AlbumModel from '../models/album.js';

function parseArtistResponse (response) {
  if (response.data.length < 1) {
    alert('No albums found.');

    return;
  }

  return response.data.map(item => {
    const album = {};

    album.id = item.id;
    album.name = item.title;
    album.cover = item.cover_medium;
    album.tracks = [];

    return album;
  });
}

export default class AlbumCollection extends Collection {
  model = AlbumModel;

  constructor(models, { artistId }) {
    super();

    this.model = AlbumModel;
    this.artistId = artistId;

    $('.track-list').removeClass('show');

    DZ.api('/artist/' + artistId, function (response) {
      $('.search-results h2').text('Albums from ' + response.name);
    });
  }

  url () {
    return this.artistId;
  }

  sync (method, model) {
    DZ.api('/artist/' + model.artistId + '/albums', response => this.push(parseArtistResponse(response)));
  }
}
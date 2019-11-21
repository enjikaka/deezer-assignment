import { Collection } from '../backbone.js';
import SuggestionModel from '../models/suggestion.js';

export default Collection.extend({
  model: SuggestionModel,
  url () {
    return this.query;
  },
  sync (method, model) {
    var self = this;

    // Fetch suggestions from the Deezer API
    DZ.api('/search/autocomplete?q=' + encodeURIComponent(model.query), function(response) {
      self.parse(response);
    });
  },
  initialize () {
    this.query = '';
  },
  parse (response) {
    if (response.artists === undefined) {
      return;
    }


    this.push(response.artists.data.map(({ name, id }) => ({ name, id })));

    return this.models;
  }
});
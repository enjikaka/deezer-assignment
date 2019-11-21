/* globals $, DZ */
import { View } from '../backbone.js';
import SuggestionCollection from '../collections/suggestion.js';
import appRouter from '../router.js';

import SuggestionView from './suggestion.js';

export default View.extend({
  el: '#search',
  events: {
    'input #search-input': 'fetchCollection',
    'keyup #search-input': 'search',
    'click button': 'search'
  },
  collection: new SuggestionCollection(),
  initialize (options) {
    this.options = options || {};

    this.collection.bind('add', () => this.render());
  },
  search (event) {
    const artistName = $('#search input').val();
    const artistId = $(`#search option[value="${artistName}"]`).attr('data-id');

    if (event.keyCode === 13) {
      $('#search input').blur();
    }

    if (!artistId) {
      return;
    }

    $('.search-results').removeClass('show');

    appRouter.navigate('/artist/' + artistId, {trigger: true});
  },
  fetchCollection (event) {
    const bannedKeycodes = [32, 38, 40, 9, 8, 13];

    if (bannedKeycodes.indexOf(event.keyCode) !== -1) {
      return;
    }

    this.collection.query = $('#search-input').val();

    if (this.collection.query === '') {
      this.$el.find('#suggestions').html('');
      return;
    }

    this.collection.fetch();
  },
  render () {
    this.$el.find('#suggestions').html('');

    this.collection.each(function(suggestion) {
      const suggestionView = new SuggestionView({ model: suggestion });

      this.$el.find('#suggestions').append(suggestionView.render().el);
    }, this);

    return this;
  }
})
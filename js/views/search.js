/* globals $, DZ */
import { View } from '../backbone.js';
import { html, render } from 'https://unpkg.com/lit-html@1.1.2/lit-html.js';

import SuggestionCollection from '../collections/suggestion.js';
import appRouter from '../router.js';

const suggestionTemplate = ({ name, id }) => html`
  <option data-id="${id}" value="${name}">
`;

const template = suggestions => html`
  <input type="text" id="search-input" list="suggestions" placeholder="Search for an artist...">
  <datalist id="suggestions">${suggestions.map(suggestionTemplate)}</datalist>
  <button>Search</button>
`;

export default View.extend({
  el: '#search',
  events: {
    'input #search-input': 'fetchCollection',
    'keyup #search-input': 'search',
    'click button': 'search'
  },
  template,
  collection: new SuggestionCollection(),
  initialize (options) {
    this.options = options || {};

    this.collection.bind('add', () => this.render());

    this.render();
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
    render(this.template(this.collection.map(s => s.toJSON())), this.$el[0]);

    return this;
  }
})
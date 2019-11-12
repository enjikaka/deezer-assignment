/* globals $, DZ */
import { View } from '../backbone.js';
import AlbumView from './album.js'

export default View.extend({
  el: '#albums',
  initialize: function(options = {}) {
    this.options = options;

    this.collection = this.options.collection;
    this.collection.fetch();

    this.collection.bind('add', () => {
      this.render();

      $('.search-results').addClass('show');
    });
  },
  render: function() {
    while (this.el.firstChild) {
      this.el.firstChild.remove();
    }

    const frag = document.createDocumentFragment();

    this.collection.forEach(model => {
      const albumView = new AlbumView({ model });

      frag.appendChild(albumView.render().el);
    }, this);

    this.el.appendChild(frag);

    return this;
  }
});

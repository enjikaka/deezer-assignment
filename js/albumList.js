/* globals Backbone, $, DZ */
import { currentTrackListView } from './app.js';
import appRouter from './router.js';

export const AlbumModel = Backbone.Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null,
    cover: null
  }
});

export const AlbumCollection = Backbone.Collection.extend({
  model: AlbumModel,
  url: function() {
    return this.artistId;
  },
  sync: function(method, model) {
    var self = this;

    DZ.api('/artist/' + model.artistId + '/albums', function(response) {
      self.parse(response);
    });
  },
  initialize: function(data, settings) {
    this.artistId = settings.artistId;

    $('.track-list').removeClass('show');

    DZ.api('/artist/' + settings.artistId, function(response) {
      $('.search-results h2').text('Albums from ' + response.name);
    });
  },
  parse: function(response) {
    var album = {};
    var self = this;

    if (response.data.length < 1) {
      alert('No albums found.');
      return;
    }

    $.map(response.data, function(item) {
      album.id = item.id;
      album.name = item.title;
      album.cover = item.cover_medium;
      album.tracks = [];

      self.push(album);
    });

    return this.models;
  }
});

export const AlbumView = Backbone.View.extend({
  tagName: 'figure',
  events: {
    'click': 'viewTrackList'
  },
  viewTrackList: function () {
    appRouter.navigate('/album/' + this.model.attributes.id, {trigger: true});
  },
  template: _.template('<img src="<%= cover %>" alt="<%= name %>"><figcaption><%= name %></figcaption>'),
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.attr('value', this.model.toJSON().name);
    this.$el.attr('label', this.model.toJSON().id);
    return this;
  }
});

export const AlbumListView = Backbone.View.extend({
  el: '#albums',
  initialize: function(options) {
    this.options = options || {};

    this.collection = this.options.collection;
    this.collection.fetch();

    this.collection.bind('add', () => {
      this.render();

      $('.search-results').addClass('show');

      if (currentTrackListView !== undefined) {
        currentTrackListView.pauseAudio();
      }
    });
  },
  render: function() {
    this.$el.html('');

    this.collection.each(function(album) {
      var albumView = new AlbumView({ model: album });
      this.$el.append(albumView.render().el);
    }, this);

    return this;
  }
});

/*
  
  Handles listing albums

*/

//var albumListView, trackListView, trackCollection;

App.Model.Album = Backbone.Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null,
    cover: null
  },
  name: function() {
    return this.get('name');
  },
  cover: function() {
    return this.get('cover');
  }
});

App.Collection.Album = Backbone.Collection.extend({
  model: App.Model.Album,
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

App.View.Album = Backbone.View.extend({
  tagName: 'figure',
  events: {
    'click': 'viewTrackList'
  },
  viewTrackList: function() {
    var albumId = this.model.attributes.id;
    document.location.hash = "#/album/" + albumId;
  },
  template: _.template('<img src="<%= cover %>" alt="<%= name %>"><figcaption><%= name %></figcaption>'),
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.attr('value', this.model.toJSON().name);
    this.$el.attr('label', this.model.toJSON().id);
    return this;
  }
});

App.View.AlbumList = Backbone.View.extend({
  el: '#albums',
  initialize: function(options) {
    var self = this;
    this.options = options || {};
    this.collection = this.options.collection;
    this.collection.fetch();
    this.collection.bind('add', function() {
      self.render();
      $('.search-results').addClass('show');
    });
  },
  render: function() {
    this.$el.html('');

    this.$el.className = 'album';

    this.collection.each(function(album) {
      var albumView = new App.View.Album({ model: album });
      this.$el.append(albumView.render().el);
    }, this);

    return this;
  }
});

function getArtistIdFromName(name) {
  return $('#search option[value="'+name+'"]').attr('label');
}
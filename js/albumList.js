/*
  
  Handles listing albums

*/


var AlbumList = Backbone.Model.extend({
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

var AlbumListCollection = Backbone.Collection.extend({
  model: AlbumList,
  url: function() {
    return this.artistId;
  },
  sync: function(method, model) {
    var self = this;

    DZ.api('/artist/' + model.artistId + '/albums', function(response) {
      self.parse(response);
    });
  },            
  initialize: function(options, settings) {
    this.artistId = settings.artistId;
  },
  parse: function(response) {
    var album = {};  
    var self = this;

    $.map(response.data, function(item) {
      album.id = item.id;
      album.name = item.title;
      album.cover = item.cover;

      self.push(album);
    });

    return this.models;
  }
});

var AlbumListView = Backbone.View.extend({
  tagName: 'figure',
  events: {
    'click': 'shout'
  },
  template: _.template('<img src="<%= cover %>" alt="<%= name %>"><figcaption><%= name %></figcaption>'),
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.attr('value', this.model.toJSON().name);
    this.$el.attr('label', this.model.toJSON().id);
    return this;
  },
  shout: function() {
    document.querySelector('.open-album').classList.toggle('show');
  }
});

var AlbumsListView = Backbone.View.extend({
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
      var albumView = new AlbumListView({ model: album });
      this.$el.append(albumView.render().el);
    }, this);

    return this;
  }
});

var albumListView;


function getArtistIdFromName(name) {
  return $('#search option[value="'+name+'"]').attr('label');
}

$('#search button').on('click', function() {
  var artistName = $('#search input').val();
  var artistId = getArtistIdFromName(artistName);
  
  console.debug('Fetching albums from artist #' + artistId + ' ('+artistName+')');
  
  albumsListView = new AlbumsListView({
    collection: new AlbumListCollection([], {
      artistId: artistId
    })
  });

  $('.search-results h2').text('Albums from ' + artistName);
});
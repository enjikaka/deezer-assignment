/*

  Models:
  - Album

  Views:
  - AlbumView   (mono)
  - AlbumsView  (poly)
  
  Collections:
  - AlbumCollection

*/


var Album = Backbone.Model.extend({
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

var AlbumCollection = Backbone.Collection.extend({
  model: Album,
  url: function() {
    return 'https://api.spotify.com/v1/artists/' + this.artistId + '/albums';
  },            
  initialize: function(options, settings) {
    this.artistId = settings.artistId;
  },
  parse: function(response) {
    console.log(response);

    var album = {};  
    var self = this;

    $.map(response.items, function(item) {
      album.id = item.id;
      album.name = item.name;
      album.cover = item.images[0].url;

      self.push(album);
    });

    return this.models;
  }
});

var AlbumView = Backbone.View.extend({
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

var AlbumsView = Backbone.View.extend({
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
      var albumView = new AlbumView({ model: album });
      this.$el.append(albumView.render().el);
    }, this);

    return this;
  }
});

var albumsView;


function getArtistIdFromName(name) {
  return $('#search option[value="'+name+'"]').attr('label');
}

$('#search button').on('click', function() {
  var artistName = $('#search input').val();
  var artistId = getArtistIdFromName(artistName);
  
  console.debug('Fetching albums from artist #' + artistId + ' ('+artistName+')');
  
  albumsView = new AlbumsView({
    collection: new AlbumCollection([], {
      artistId: artistId
    })
  });

  $('.search-results h2').text('Albums from ' + artistName);
});
/*
  
  Handles fetching suggestions in the search bar

*/

App.Model.Suggestion = Backbone.Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null
  },
  name: function() {
    return this.get('name');
  }
});

App.Collection.Suggestion = Backbone.Collection.extend({
  model: App.Model.Suggestion,
  url: function() {
    return this.query;
  },
  sync: function(method, model) {
    var self = this;

    // Fetch suggestions from the Deezer API
    DZ.api('/search/autocomplete?q=' + encodeURIComponent(model.query), function(response) {
      self.parse(response);
    });
  }, 
  initialize: function() {
    this.query = '';
  },
  parse: function(response) {
    var suggestion = {};  
    var self = this;

    $.map(response.artists.data, function(item) {
      suggestion.id = item.id;
      suggestion.name = item.name;

      self.push(suggestion);
    });

    return this.models;
  }
});

App.View.Suggestion = Backbone.View.extend({
  tagName: 'option',
  template: _.template('<%= name %>'),
  render: function() {
    // Put the suggestions in the <datalist>
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.attr('value', this.model.toJSON().name);
    this.$el.attr('label', this.model.toJSON().id);
    return this;
  }
});

App.View.Suggestions = Backbone.View.extend({
  el: '#search',
  events: {
    'input #search-input': 'fetchCollection',
    'focus #search-input': 'removeHash',
    'click button': 'search'
  },
  initialize: function(options) {
    this.options = options || {};
    this.collection = new App.Collection.Suggestion();
    this.render();
  },
  removeHash: function() {
    document.location.hash = '';
  },
  search: function() {
    var artistName = $('#search input').val();
    var artistId = getArtistIdFromName(artistName);
    $('.search-results').removeClass('show');

    if (!artistId) {
      return;
    }
    
    App.Instance.albumListView = new App.View.AlbumList({
      collection: new App.Collection.Album([], {
        artistId: artistId
      })
    });

    $('.search-results h2').text('Albums from ' + artistName);
  },
  fetchCollection: function(event) {
    var bannedKeycodes = [32, 38, 40, 9, 8, 13];

    if (bannedKeycodes.indexOf(event.keyCode) !== -1) {
      return;
    }

    var self = this;
    this.collection.query = $('#search-input').val();
    if (this.collection.query === '') {
      this.$el.find('#suggestions').html('');
      return;
    }
    setTimeout(function() {
      self.collection.fetch();
      self.render();
    }, 500);
  },
  render: function() {
    this.$el.find('#suggestions').html('');
    this.collection.each(function(suggestion) {
      var suggestionView = new App.View.Suggestion({ model: suggestion });
      this.$el.find('#suggestions').append(suggestionView.render().el);
    }, this);

    return this;
  }
});

App.Instance.suggestionsView;
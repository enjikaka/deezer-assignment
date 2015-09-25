/*

  I have never used backbone b4 lulz

*/

var Suggestion = Backbone.Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null
  },
  name: function() {
    return this.get('name');
  }
});

var SuggestionCollection = Backbone.Collection.extend({
  model: Suggestion,
  url: function() {
    return "https://api.spotify.com/v1/search?q=" + this.query + "&type=artist";
  },            
  initialize: function() {
    this.query = '';
  },
  parse: function(response) {
    var suggestion = {};  
    var self = this;

    $.map(response.artists.items, function(item) {
      suggestion.id = item.id;
      suggestion.name = item.name;

      self.push(suggestion);
    });

    return this.models;
  }
});

var SuggestionView = Backbone.View.extend({
  tagName: 'option',
  template: _.template('<%= name %>'),
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var SuggestionsView = Backbone.View.extend({
  el: '#search',
  events: {
    'input #search-input': 'fetchCollection'
  },
  initialize: function(options) {
    this.options = options || {};
    this.collection = new SuggestionCollection();
    this.render();
  },
  fetchCollection: function(event) {
    var bannedKeycodes = [32, 38, 40, 13, 9];

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
      var suggestionView = new SuggestionView({ model: suggestion });
      this.$el.find('#suggestions').append(suggestionView.render().el);
    }, this);

    return this;
  }
});

var suggestionsView = new SuggestionsView({model: new Suggestion()});
Backbone.history.start();

document.querySelector('.search-results .album').addEventListener('click', function() {
  document.querySelector('.open-album').classList.toggle('show');
});
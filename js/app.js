/*

  I have never used backbone b4 lulz

*/

var Search = Backbone.Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null
  },
  name: function() {
    return this.get('name');
  }
});

var SearchCollection = Backbone.Collection.extend({
  model: Search,
  url: function() {
     return "https://api.spotify.com/v1/search?q=" + this.query + "&type=artist";
  },            
  initialize: function(models, options) {
     this.query = options.query;
  },
  parse: function(response) {
     var search = {};  
     var self = this;
     
     $.map(response.artists.items, function(item) {
        search.id = item.id;
        search.name = item.name;
        search.label = item.name;
        search.infos = item.name;

        self.push(search);
     });
     return this.models;
  }
 });

var SearchView = Backbone.View.extend({
  el: '#search',
  template: _.template($('#search-template').html(), {}),

  events: {
     'focus #search_input':    'autocomplete',
     'keydown #search_input':  'updateData'
  },

  initialize: function() {
     this.searchCollection = new SearchCollection([], {query: $('input[name=artist]').val()});
     this.render();
  },

  render: function() {
     this.$el.html(this.template(this.model.toJSON()));
     return this;
  },

  updateData: function() {
    console.debug('UD');
    var self = this;

    this.searchCollection.query = $('input[name=artist]').val();

    self.searchCollection.fetch();

    $('#search_input').unbind('keydown', function() {
      self.updateData();
    });
  },

  autocomplete: function () {
    var self = this;

    //$('.search-suggestions').addClass('show');
    //searchView.searchCollection.query = $('input[name=artist]').val();

    $('#search_input').autocomplete({
      collection: self.searchCollection,
      attr: 'label',
      noCase: true,
      onselect: self.autocompleteSelect,
      max_results: 15
    });
  },

  autocompleteSelect: function(model) {
    $('input[name=artist]').val(model.label());
  }

});

var searchView = new SearchView({model: new Search()});
Backbone.history.start();

/*document.querySelector('.search-box button').addEventListener('click', function() {
  console.log(albums);
});

document.querySelector('.search-results .album').addEventListener('click', function() {
  document.querySelector('.open-album').classList.toggle('show');
});*/
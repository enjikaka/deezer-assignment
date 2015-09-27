/*
  
  Handles listing tracks for an album

*/

var Track = Backbone.Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null,
    position: null,
    duration: null,
    preview: null
  }
});

var TrackCollection = Backbone.Collection.extend({
  model: Track,
  initialize: function(data, settings) {
    this.push(data);
  }
});

var TrackListView = Backbone.View.extend({
  el: '#track-list',
  initialize: function(viewData) {
    this.viewData = viewData;
    this.render();
  },
  render: function() {
    // Fetch template from DOM
    var template = _.template($('#tracklist-template').html());
    // Render the template with data from viewData to this Views' element
    this.$el.html(template(this.viewData));

    // Add the class "show" to this Views' element
    $('#track-list').addClass('show');

    $('button[data-play]').on('click', function(event) {
      var audio = $('#audio')[0];
      audio.src = event.target.dataset.play;
      audio.play();
    });

    // Make the browser jump to the now visible trackview when it is out of the viewport
    document.location.hash = '';
    document.location.hash = '#track-list';
  }
});
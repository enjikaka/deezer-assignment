import App from './app.js';
import './router.js';
import './suggestions.js';

App.Instance.suggestionsView = new App.View.Suggestions({model: new App.Model.Suggestion()});
Backbone.history.start();

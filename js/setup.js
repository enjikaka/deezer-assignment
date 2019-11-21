import Backbone from './backbone.js';
import './router.js';

import SuggestionsView from './views/suggestions.js';

Backbone.history.start();

new SuggestionsView();

import Backbone from './backbone.js';
import './router.js';

import SearchView from './views/search.js';

Backbone.history.start();

new SearchView();

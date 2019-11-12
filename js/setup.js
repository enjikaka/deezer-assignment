import Backbone from './backbone.js';
import './router.js';
import { SuggestionsView } from './suggestions.js';

Backbone.history.start();
const suggestionsView = new SuggestionsView();

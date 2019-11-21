import { Model } from '../backbone.js';

export default Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null
  }
});
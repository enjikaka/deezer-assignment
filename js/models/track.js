import { Model } from '../backbone.js';

export default Model.extend({
  idAttribute: "id",
  defaults: {
    id: null,
    name: null,
    position: null,
    duration: null,
    preview: null
  }
});

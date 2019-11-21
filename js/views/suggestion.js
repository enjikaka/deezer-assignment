/* globals $, DZ */
import { View } from '../backbone.js';

export default View.extend({
  tagName: 'option',
  render () {
    this.$el.attr('value', this.model.toJSON().name);
    this.$el.attr('data-id', this.model.toJSON().id);

    return this;
  }
});

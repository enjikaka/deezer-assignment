import { View } from '../backbone.js';
import { html, render } from 'https://unpkg.com/lit-html@1.1.2/lit-html.js';
import appRouter from '../router.js';

export const template = ({ cover, name }) => html`
  <img src="${cover}" alt="${name}">
  <figcaption>${name}</figcaption>
`;

export default View.extend({
  tagName: 'figure',
  events: {
    'click': 'viewTrackList'
  },
  viewTrackList: function () {
    appRouter.navigate('/album/' + this.model.attributes.id, { trigger: true });
  },
  template,
  render: function () {
    render(
      this.template(this.model.toJSON()),
      this.$el[0]
    );

    this.$el.attr('value', this.model.toJSON().name);
    this.$el.attr('label', this.model.toJSON().id);

    return this;
  }
});

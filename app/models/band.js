import Ember from 'ember';

export default Ember.Object.extend({
  name: '',
  description: '',

  setupSongs: function() {
    if (!this.get('songs')) {
      this.set('songs', []);
    }
  }.on('init'),

  slug: function() {
    return this.get('name').dasherize();
  }.property('name'),
});
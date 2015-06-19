import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('band', params.id);
  },

  afterModel: function(band) {
    var description = band.get('description');
    if (Ember.isEmpty(description)) {
      this.transitionTo('band.songs');
    } else {
      this.transitionTo('band.details');
    }
  }
});

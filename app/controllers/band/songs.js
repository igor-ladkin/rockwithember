import Ember from 'ember';

export default Ember.Controller.extend({
  isAddButtonDisabled: function() {
    return Ember.isEmpty(this.get('title'));
  }.property('title')
});

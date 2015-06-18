import Ember from 'ember';

export default Ember.Controller.extend({
  name: '',

  isAddButtonDisabled: function() {
    return Ember.isEmpty(this.get('name'));
  }.property('name')
});

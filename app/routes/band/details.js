import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    save: function() {
      var controller = this.controller;
      var band = controller.get('model');

      return band.save();
    },
    willTransition: function(transition) {
      var controller = this.controller;
      var leave;

      if (controller.isEditing) {
        leave = window.confirm('You have unsaved changes. Are you sure you want to leave?');

        if (leave) {
          controller.set('isEditing', false);
        } else {
          transition.abort();
        }
      }
    }
  }
});

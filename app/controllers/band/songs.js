import Ember from 'ember';

export default Ember.Controller.extend({
  songCreationStarted: false,

  isAddButtonDisabled: function() {
    return Ember.isEmpty(this.get('title'));
  }.property('title'),

  canCreateSong: function() {
    return this.get('songCreationStarted') || this.get('model.length');
  }.property('songCreationStarted', 'model.length'),

  actions: {
    enableSongCreation: function() {
      return this.set('songCreationStarted', true);
    }
  }
});

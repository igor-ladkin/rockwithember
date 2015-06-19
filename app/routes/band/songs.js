import Ember from 'ember';

import Song from '../../models/song';

export default Ember.Route.extend({
  model: function() {
    return this.modelFor('band').get('songs');
  },

  actions: {
    didTransition: function() {
      var band = this.modelFor('band');
      Ember.$(document).attr('title', '%@ songs - Rock & Roll'.fmt(band.get('name')));
    },

    createSong: function() {
      var controller = this.get('controller');
      var band = this.modelFor('band');
      var title = controller.get('title');

      var song = Song.create({ title: title, band: band });
      band.get('songs').pushObject(song);
      controller.set('title', '');
    },

    updateRating: function(params) {
      var song = params.item;
      var rating = params.rating;

      song.set('rating', rating);
    }
  }
});

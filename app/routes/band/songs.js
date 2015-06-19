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
      var controller = this.controller;
      var band = this.modelFor('band');

      var song = this.store.createRecord('song', {
        title: controller.get('title'),
        band: band
      });
      song.save().then(function() {
        controller.set('title', '');
      });
    },

    updateRating: function(params) {
      var song = params.item;
      var rating = params.rating;

      song.set('rating', rating);
    }
  }
});

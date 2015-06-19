import Ember from 'ember';

import Band from '../models/band';
import Song from '../models/song';

var blackDog = Song.create({
  title: 'Black Dog',
  band: 'Led Zeppelin',
  rating: 3
});

var yellowLedbetter = Song.create({
  title: 'Yellow Ledbetter',
  band: 'Pearl Jam',
  rating: 4
});

var pretender = Song.create({
  title: 'Pretender',
  band: 'Foo Fighters',
  rating: 2
});

var daughter = Song.create({ 
  title: 'Daughter',
  band: 'Pearl Jam', 
  rating: 5
});

var BandsCollection = Ember.ArrayProxy.extend({
  sortProperties: ['name'],
  sortAscending: false,
  content: []
});

var bands = BandsCollection.create();

var ledZeppelin = Band.create({ name: 'Led Zeppelin', songs: [blackDog] });
var pearlJam = Band.create({ name: 'Pearl Jam', songs: [daughter, yellowLedbetter] });
var fooFighters = Band.create({ name: 'Foo Fighters', songs: [pretender] });
var u2 = Band.create({
  name: 'U2',
  description: 'U2 are an Irish rock band from Dublin.'
});

bands.pushObjects([ledZeppelin, pearlJam, fooFighters, u2]);

export default Ember.Route.extend({
  model: function() {
    return bands;
  },

  actions: {
    createBand: function() {
      var name = this.get('controller').get('name');
      var band = Band.create({ name: name });
      bands.pushObject(band);
      this.get('controller').set('name', '');
      this.transitionTo('band.songs', band);
    }
  }
});

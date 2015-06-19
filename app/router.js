import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('bands', function() {
    this.resource('band', { path: ':id' }, function() { 
      this.route('songs');
      this.route('details');
    });
  });
});

export default Router;

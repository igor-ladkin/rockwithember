import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'rarwe/tests/helpers/start-app';
import Pretender from 'pretender';
import httpStubs from '../helpers/http-stubs';

var application,
    server;

module('Acceptance | bands', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
    server.shutdown();
  }
});

test('List bands', function(assert) {
  server = new Pretender(function() {
    httpStubs.stubBands(this, {
      bands: [
        { id: 1, name: 'Radiohead' },
        { id: 2, name: 'Long Distance Calling' }
      ]
    });
  });

  visit('/bands');

  andThen(function() {
    assertLength(assert, '.band-link', 2, 'All band links are rendered');
    assertElement(assert, '.band-link:contains("Radiohead")', 'First band link contains the band name');
    assertElement(assert, '.band-link:contains("Long Distance Calling")', 'Other band link contains the band name');
  });
});

test('Create a new band', function(assert) {
  server = new Pretender(function() {
    httpStubs.stubBands(this, {
      bands: [
        { id: 1, name: 'Radiohead' }
      ]
    });

    httpStubs.stubCreateBand(this, { id: 2, name: 'Long Distance Calling' });
  });

  visit('/bands');
  fillIn('.new-band', 'Long Distance Calling');
  click('.new-band-button');

  andThen(function() {
    assertLength(assert, '.band-link', 2, 'All band links are rendered');
    assertTrimmedText(assert, '.band-link:last', 'Long Distance Calling', 'Created band appears at the end of the list');
    assertElement(assert, '.nav a.active:contains("Songs")', 'The Songs tab is active');
  });
});

test('Create a new song in two steps', function(assert) {
  server = new Pretender(function() {
    this.get('/bands', function(request) {
      var bands = JSON.stringify({
        bands: [
          { id: 1, name: 'Radiohead' }
        ]
      });

      return [200, { 'Content-Type': 'application/json' }, bands];
    });

    this.post('/songs', function(request) {
      var song = JSON.stringify({
        song: {
          id: 1,
          title: 'Killer Cars'
        }
      });

      return [200, { 'Content-Type': 'application/json' }, song];
    });
  });

  selectBand('Radiohead');
  click('a:contains("create one")');
  fillIn('.new-song', 'Killer Cars');
  triggerEvent('.new-song', 'submit');

  andThen(function() {
    assertElement(assert, '.songs .song:contains("Killer Cars")', 'Creates the song and displays it in the list');
  });
});

test('Sort songs in various ways', function(assert) {
  server = new Pretender(function() {
    httpStubs.stubBands(this, {
      bands: [
        { id: 1, name: 'Them Crooked Vultures', songs: [1, 2, 3, 4] }
      ],
      songs: [
        { id: 1, title: 'Elephants', rating: 5 },
        { id: 2, title: 'New Fang', rating: 4 },
        { id: 3, title: 'Mind Eraser, No Chaser', rating: 4 },
        { id: 4, title: 'Spinning In Daffodils', rating: 5 }
      ]
    });
  });

  selectBand('Them Crooked Vultures');
  andThen(function() {
    assert.equal(currentURL(), '/bands/1/songs');
    assertTrimmedText(assert, '.song:first', 'Elephants', 'The first song is the highest ranked, first in the alphabet');
    assertTrimmedText(assert, '.song:last', 'New Fang', 'The last song is the lowest ranked, last in the alphabet');
  });

  click('button.sort-title-desc');
  andThen(function() {
    assert.equal(currentURL(), '/bands/1/songs?sort=titleDesc');
    assertTrimmedText(assert, '.song:first', 'Spinning In Daffodils', 'The first song is the one that is the last in the alphabet');
    assertTrimmedText(assert, '.song:last', 'Elephants', 'The last song is the one that is the first in the alphabet');
  });

  click('button.sort-rating-asc');
  andThen(function() {
    assert.equal(currentURL(), '/bands/1/songs?sort=ratingAsc');
    assertTrimmedText(assert, '.song:first', 'Mind Eraser, No Chaser', 'The first song is the lowest ranked, first in the alphabet'); 
    assertTrimmedText(assert, '.song:last', 'Spinning In Daffodils', 'The last song is the highest ranked, last in the alphabet');
  });
});

test('Search songs', function(assert) {
  server = new Pretender(function() {
    httpStubs.stubBands(this, {
      bands: [
        { id: 1, name: 'Them Crooked Vultures', songs: [1, 2, 3, 4, 5] }
      ],
      songs: [
        { id: 1, title: 'Elephants', rating: 5 },
        { id: 2, title: 'New Fang', rating: 4 },
        { id: 3, title: 'Mind Eraser, No Chaser', rating: 4 },
        { id: 4, title: 'Spinning In Daffodils', rating: 5 },
        { id: 5, title: 'No One Loves Me & Neither Do I', rating: 3 },
      ]
    });
  });

  selectBand('Them Crooked Vultures');

  fillIn('.search-field', 'no');
  andThen(function() {
    assertLength(assert, '.song', 2, 'The songs matching the search term are displayed');
  });

  click('button.sort-title-desc');
  andThen(function() {
    assertTrimmedText(assert, '.song:first', 'No One Loves Me & Neither Do I', 'The matching song that comes later in the alhapbet appears on top');
    assertTrimmedText(assert, '.song:last', 'Mind Eraser, No Chaser', 'The matching song that comes sooner in the alhapbet appears on top');
  });
});

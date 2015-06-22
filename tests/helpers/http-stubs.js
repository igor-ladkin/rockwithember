export default {
  stubBands: function(pretender, data) {
    pretender.get('/bands', function() {
      return [200, { 'Content-Type': 'application/json' }, JSON.stringify(data)];
    });
  },

  stubCreateBand: function(pretender, band) {
    pretender.post('/bands', function() {
      return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ band: band })];
    });
  },

  stubCreateSong: function(pretender, song) {
    pretender.post('/songs', function() {
      return [200, { 'Content-Type': 'application/json' }, JSON.stringify({ song: song })];
    });
  }
};
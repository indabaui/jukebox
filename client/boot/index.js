var page = require('page')
var agent = require('agent')
var OpportunityRow = require('opportunity-row')
var OpportunityView = require('opportunity-view')

require('./playback.js')

page('/opportunities', function(req) {
  Stage.innerHTML = "";
  agent.inGetAll(req.path, function(err, data) {
    data.forEach(function(datum) {
      var row = new OpportunityRow(datum);
      Stage.appendChild(row.el);
    });
  })
});


page('/opportunities/:slug', function(req) {
  Stage.innerHTML = "";
  agent.inGet(req.path, function(err, opp) {
    var view = new OpportunityView(opp);
    Stage.appendChild(view.el);
  })
})

page()



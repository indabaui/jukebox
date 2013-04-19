var Router = require('router')
var agent = require('agent')
var OpportunityItem = require('opportunity-item')
var OpportunityView = require('opportunity-view')
require('./playback.js')

var router = new Router();

router.get('', function() {
  window.location.hash = '#/opportunities';
});
router.get('/opportunities', oppIndex)
router.get('/opportunities/:slug', oppDetail)

function oppIndex() {
  Stage.innerHTML = "";
  agent.inGetAll('/opportunities', function(err, data) {
    data.forEach(function(datum) {
      var row = new OpportunityItem(datum);
      Stage.appendChild(row.el);
    });
  })
}

function oppDetail(slug) {
  Stage.innerHTML = "";
  agent.inGet('/opportunities/' + slug, function(err, opp) {
    var view = new OpportunityView(opp);
    Stage.appendChild(view.el);
  })
}



window.onhashchange = dispatch;
dispatch();

function dispatch() {
  var path = window.location.hash.replace('#', '')
  router.dispatch(path);
}

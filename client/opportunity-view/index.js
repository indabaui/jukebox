var domify = require('domify')
  , tmpl = domify(require('./template'))[0]
  , View = require('view')
  , bus = require('bus')
  , agent = require('agent')
  , SubmissionRow = require('submission-row')

module.exports = OpportunityView;

function OpportunityView(opportunity) {
  View.call(this, opportunity, tmpl.cloneNode(true))
  this.el.querySelector('.artwork').style.backgroundColor = '#' + opportunity.background_color;
  this.submissions = []
  this.submissionsEl = this.el.querySelector('.submissions')
  this.more()
}

OpportunityView.prototype.artworkImg = function() {
  return this.obj.image_urls.large_background_image;
}

OpportunityView.prototype.more = function() {
  var self = this;
  agent.inGet('/opportunities/' + this.obj.slug + '/submissions', {offset: self.submissions.length}, function(err, data) {
    data.forEach(function(submission) {
      var submissionRow = new SubmissionRow(submission);
      self.submissionsEl.appendChild(submissionRow.el);
      self.submissions.push(submission)
    });
  })
}


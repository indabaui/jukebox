/*jshint newcap: false */
var domify = require('domify')
  , tmpl = domify(require('./template'))[0]
  , View = require('view')
  , bus = require('bus')
  , agent = require('agent')
  , SubmissionItem = require('submission-item')
  , Emitter = require('emitter')
  , throttle = require('throttle')
  , query = require('query')

module.exports = OpportunityView;

function OpportunityView(opportunity) {
  View.call(this, Emitter(opportunity), tmpl.cloneNode(true))
  this.el.style.backgroundColor = '#' + opportunity.background_color;
  this.submissions = []
  this.submissionsEl = this.el.querySelector('.submissions')
  this.more()
  this.submissionsContainer = this.el.querySelector('.submissions-container')
  this.submissionsContainer.addEventListener('scroll', this.onSubmissionsScroll.bind(this))

}

OpportunityView.prototype.artworkImg = function() {
  return this.obj.image_urls.large_background_image;
}

OpportunityView.prototype.onSubmissionsScroll = throttle(function(ev) {
  var container = this.submissionsContainer;
  if (container.scrollHeight - container.scrollTop < container.clientHeight * 2) {
    this.more();
  }
}, 100);

OpportunityView.prototype.more = function() {
  var self = this;
  if (self.obj.loadingSubmissions || self.obj.noMoreSubmissions) return;
  self.obj.loadingSubmissions = true;
  self.obj.emit('change loadingSubmissions', true);
  agent.inGet('/opportunities/' + this.obj.slug + '/submissions', {offset: self.submissions.length}, function(err, data) {
    if (data.length === 0) {
      self.obj.noMoreSubmissions = true;
      self.obj.emit('change noMoreSubmissions')
    }
    data.forEach(function(submission) {
      var submissionItem = new SubmissionItem(submission);
      self.submissionsEl.appendChild(submissionItem.el);
      self.submissions.push(submission)
    });
    self.obj.loadingSubmissions = false;
    self.obj.emit('change loadingSubmissions');
  })
}


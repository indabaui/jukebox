var domify = require('domify')
  , tmpl = domify(require('./template'))[0]
  , View = require('view')
  , bus = require('bus')
  , agent = require('agent')
  , SubmissionItem = require('submission-item')
  , Emitter = require('emitter')

module.exports = OpportunityView;

function OpportunityView(opportunity) {
  View.call(this, Emitter(opportunity), tmpl.cloneNode(true))
  this.el.querySelector('.artwork').style.backgroundColor = '#' + opportunity.background_color;
  this.submissions = []
  this.submissionsEl = this.el.querySelector('.submissions')
  this.more()
  this.el
    .querySelector('.submissions-container')
    .addEventListener('scroll', this.onScrollSubmissions.bind(this))
}

OpportunityView.prototype.artworkImg = function() {
  return this.obj.image_urls.large_background_image;
}

OpportunityView.prototype.onScrollSubmissions = function(ev) {
  var container = ev.srcElement;
  if (container.scrollWidth - container.scrollLeft < container.clientWidth * 2) {
    this.more();
  }
}

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


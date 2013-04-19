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

  var scrollDirection = 0;
  query('.scroll-left', this.el).addEventListener('mouseover', function() {
    scrollDirection = -1;
  });
  query('.scroll-left', this.el).addEventListener('mouseout', function() {
    scrollDirection = 0;
  });
  query('.scroll-right', this.el).addEventListener('mouseover', function() {
    scrollDirection = 1;
  });
  query('.scroll-right', this.el).addEventListener('mouseout', function() {
    scrollDirection = 0;
  });

  var doScroll = function() {
    if (scrollDirection !== 0) {
      console.log(scrollDirection);
      this.submissionsContainer.scrollLeft += 15 * scrollDirection;
    }
    requestAnimationFrame(doScroll);
  }.bind(this)
  requestAnimationFrame(doScroll);
}

OpportunityView.prototype.artworkImg = function() {
  return this.obj.image_urls.large_background_image;
}

OpportunityView.prototype.onSubmissionsScroll = throttle(function(ev) {
  var container = this.submissionsContainer;
  if (container.scrollLeft < 100) {
    query('.scroll-left', this.el).style.display = "none";
  } else {
    query('.scroll-left', this.el).style.display = "block";
  }
  if (container.scrollWidth - container.scrollLeft < container.clientWidth * 2) {
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


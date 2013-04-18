var domify = require('domify')
  , tmpl = domify(require('./template'))[0]
  , View = require('view')
  , bus = require('bus')

module.exports = SubmissionItem;

function SubmissionItem(submission) {
  View.call(this, submission, tmpl.cloneNode(true))
  this.el.addEventListener('click', this.play.bind(this));
  bus.on('play submission', this.onPlaySubmission.bind(this));
}

SubmissionItem.prototype.play = function() {
  bus.emit('play submission', this.obj);
}

SubmissionItem.prototype.onPlaySubmission = function(submission) {
  this.el.classList.remove('playing');
  if (submission.id === this.obj.id) {
    this.el.classList.add('playing');
  }
}

SubmissionItem.prototype.img = function() {
  return this.obj.user.image_urls.profile;
}

SubmissionItem.prototype.artist = function() {
  return this.obj.user.name;
}


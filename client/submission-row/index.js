var domify = require('domify')
  , tmpl = domify(require('./template'))[0]
  , View = require('view')
  , bus = require('bus')

module.exports = SubmissionRow;

function SubmissionRow(submission) {
  View.call(this, submission, tmpl.cloneNode(true))
  this.el.addEventListener('click', this.play.bind(this));
  bus.on('play submission', this.onPlaySubmission.bind(this));
}

SubmissionRow.prototype.play = function() {
  bus.emit('play submission', this.obj);
}

SubmissionRow.prototype.onPlaySubmission = function(submission) {
  this.el.classList.remove('playing');
  if (submission.id === this.obj.id) {
    this.el.classList.add('playing');
  }
}

SubmissionRow.prototype.img = function() {
  return this.obj.user.image_urls.detail;
}

SubmissionRow.prototype.artist = function() {
  return this.obj.user.name;
}


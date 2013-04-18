var page = require('page')
var agent = require('agent')
var SubmissionRow = require('submission-row')
var bus = require('bus')
var Player = require('player')

require('SoundManager2')
soundManager.setup({
  url: '/swf',
  debugMode: false
});

var sound, player;

bus.on('play submission', function(submission) {
  if (sound) {
    sound.destruct()
  }
  sound = soundManager.createSound({
    id: submission.id,
    url: submission.preview_url,
  });
  player = new Player(sound);
  player.setWaveformUrl(submission.waveform_url);
  player.indabaStyle();
  player.play();
  PlayerContainer.innerHTML = "";
  PlayerContainer.appendChild(player.el[0]);
});

page('/opportunities/:slug', function(req) {
  agent.inGet(req.path, function(err, opp) {
    console.log(err, opp);
  })
  agent.inGet(req.path + '/submissions', function(err, data) {
    data.forEach(function(submission) {
      var submissionRow = new SubmissionRow(submission);
      document.body.appendChild(submissionRow.el);
    });
  })
})

page()

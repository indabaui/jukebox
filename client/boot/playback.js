var Player = require('player')
var bus = require('bus')

var sm2 = require('SoundManager2')
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


const gpio = require('onoff').Gpio;
const led = new gpio(16, "out");

setInterval(function() {
  led.writeSync(led.readSync() ^ 1)
}, 100);

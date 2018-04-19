const gpio = require('onoff').Gpio;
const notifier = require('mail-notifier');
require('dotenv').config();

const gpioBlueButton = new gpio(12, "out");
const gpioGreenLed = new gpio(16, "out");
const gpioYellowLed = new gpio(20, "out");
const gpioWhiteLed = new gpio(21, "out");
const gpioOrangeBuzzer = new gpio(26, "out");

let newEmail = false;

function beep(){
  gpioOrangeBuzzer.writeSync(1)
  setTimeout(gpioOrangeBuzzer.writeSync(1), 20)
}

function doubleBeep(){
  beep;
  setTimeout(beep, 100)
}

// EMAIL IMAP NOTIFIER - CONFIGURATION
const imap = {
  user: process.env.EMAIL_NOTIFIER_USER,
  password: process.env.EMAIL_NOTIFIER_PASSWORD,
  host: process.env.EMAIL_NOTIFIER_HOST,
  port: process.env.EMAIL_NOTIFIER_PORT, // imap port
  tls: process.env.EMAIL_NOTIFIER_TLS,// use secure connection
  tlsOptions: { rejectUnauthorized: false }
};
 
// AT START SOUNDS BEEP AND BLINK WHITE LED
beep;
setInterval(function() {
  gpioWhiteLed.writeSync(gpioWhiteLed.readSync() ^ 1)
}, 200);


// EMAIL IMAP NOTIFIER - STARTUP & SETUP
notifier(imap)
  .on('mail', mail => {
    if (!newEmail){
    console.log('NUEVO EMAIL RECIVIDO!!!!!!!!');
    doubleBeep;
    gpioGreenLed.writeSync(1)
    }
   
  })
  .on('connected', () => console.log('conectado con éxito al servidor de correo de brickfunding!'))
  .start();


// EXIT RASPBERRY PI
// Listen to the event triggered at exit on CTRL+C
// and we cleanly close the GPIO pin before exiting
// so al the leds are turned off aour raspberrypi
process.on('SIGINT', function () {

  clearInterval(interval);

  gpioGreenLed.writeSync(0);
  gpioYellowLed.writeSync(0);
  gpioWhiteLed.writeSync(0);
  gpioOrangeBuzzer.writeSync(0);

  gpioBlueButton.unexport();  
  gpioGreenLed.unexport();
  gpioYellowLed.unexport();
  gpioWhiteLed.unexport();
  gpioOrangeBuzzer.unexport();
  
  console.log('Bye, bye RaspberryPi!');
  process.exit();
});


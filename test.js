const gpio = require('onoff').Gpio;
const notifier = require('mail-notifier');
require('dotenv').config();

const led16 = new gpio(16, "out");
const led21 = new gpio(21, "out");

setInterval(function() {
  led16.writeSync(led16.readSync() ^ 1)
}, 200);


const imap = {
  user: process.env.EMAIL_NOTIFIER_USER,
  password: process.env.EMAIL_NOTIFIER_PASSWORD,
  host: process.env.EMAIL_NOTIFIER_HOST,
  port: process.env.EMAIL_NOTIFIER_PORT, // imap port
  tls: process.env.EMAIL_NOTIFIER_TLS,// use secure connection
  tlsOptions: { rejectUnauthorized: false }
};
 

notifier(imap)
  .on('mail', mail => {
    console.log('NUEVO EMAIL RECIVIDO!!!!!!!!');
    console.log(mail);
    led21.writeSync(led21.readSync() ^ 1)
  })
  .on('connected', () => console.log('conectado con éxito al servidor de correo de brickfunding!'))
  .start();
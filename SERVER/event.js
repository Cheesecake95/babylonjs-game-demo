const events = require('events');
const emitter = new events.EventEmitter();

let players = {};

emitter.on('addPlayer', function () {
  console.log('join game 触发');
});

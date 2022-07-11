const AWS = require('aws-sdk');
const ENDPOINT = 'nys2vz12v6.execute-api.ap-northeast-1.amazonaws.com/production/';
const events = require('events');
const emitter = new events.EventEmitter();

emitter.on('joinGame', function () {
  console.log('join game 触发');
});
emitter.emit('joinGame');

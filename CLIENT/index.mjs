var socket = new WebSocket("wss://nys2vz12v6.execute-api.ap-northeast-1.amazonaws.com/production/");

socket.onopen = function () {
  console.log('a user conencted');
}
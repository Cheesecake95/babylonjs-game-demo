const socket = new WebSocket("wss://65loa4x8k0.execute-api.ap-northeast-1.amazonaws.com/production");

//连接建立时触发
socket.onopen = function () {
  //调用LAMBDA的$connect发送“已进入房间”
  socket.send(`"action":"$connect"`);
}
//收到消息时触发
socket.onmessage = function (event) {
  console.log(event.data);
};

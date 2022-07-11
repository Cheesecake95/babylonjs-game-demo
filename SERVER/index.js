const AWS = require('aws-sdk');
const ENDPOINT = '65loa4x8k0.execute-api.ap-northeast-1.amazonaws.com/production/';
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT });
const events = require('events');
const emitter = new events.EventEmitter();

//所有连接中的用户的name
let names = {};

const sendToOne = async (id, body) => {
  try {
    await client.postToConnection({
      'ConnectionId': id,
      'Data': Buffer.from(body)
    }).promise();
  }
  catch (err) {
    console.log(err);
  }
};

const sendToAll = async (ids, body) => {
  const all = ids.map(id => sendToOne(id, body));
  return Promise.all(all);
};

//以下handler为主程序，都是对这个当前连接的用户的
exports.handler = async (event) => {

  if (event.requestContext) {
    //获取connectionId......event.userName
    const connectionId = event.requestContext.connectionId;
    const routeKey = event.requestContext.routeKey;

    let body = {};
    //event comes from client
    try {
      if (event.body) {
        body = JSON.parse(event.body);
      }
    }
    catch (e) {
      //
    }

    //different route to the API gateway
    switch (routeKey) {
      case '$connect':
        //event.userName读不出来
        //TODO：将login时保存在session里的username带入到这里的connectionID
        names[connectionId] = 'User' + Math.floor(Math.random() * 5000);
        await sendToAll(Object.keys(names), (names[connectionId] + " has joined the chat"));
        emitter.emit('joinGame');
        break;
      case '$disconnect':
        //names的key就是connectionId
        await sendToAll(Object.keys(names), (names[connectionId] + " has left the chat"));
        //从names集合找出key为本用户connectionId的name并删除
        delete names[connectionId];
        //发送新的member名单给所有人
        await sendToAll(Object.keys(names), { members: Object.values(names) });
        break;
      case '$default':
        break;

      default:
    }
  }

  // TODO implement
  const response = {
    statusCode: 200,
  };
  return response;
};

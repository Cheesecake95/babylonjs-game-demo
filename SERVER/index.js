const AWS = require('aws-sdk');
const ENDPOINT = 'nys2vz12v6.execute-api.ap-northeast-1.amazonaws.com/production/';
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT });
const docClient = new AWS.DynamoDB.DocumentClient();

//所有连接中的用户的name
let names = {};

exports.handler = async (event) => {

  if (event.requestContext) {
    // const connenctionId = event.requestContext.connenctionId;
    const routeKey = event.requestContext.routeKey;

    let body = {};
    try {
      if (event.body) {
        body = JSON.parse(event.body);
      }
    } catch (e) { }

    switch (routeKey) {
      case '$connect':
        console.log('welcome');
        break;

      default:
      // code
    }
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
}
const request = require('request');

const options = {
  method: 'GET',
  url: 'https://api.upbit.com/v1/market/all?isDetails=false',
  headers: {Accept: 'application/json'}
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  var coin_list = JSON.parse(body);
  exports.list = coin_list;
});

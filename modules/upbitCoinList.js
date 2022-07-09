const request = require('request');

const options = {
  method: 'GET',
  url: 'https://api.upbit.com/v1/market/all?isDetails=false',
  headers: {Accept: 'application/json'}
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  return JSON.parse(body);
});

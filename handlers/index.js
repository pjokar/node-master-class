const notFoundHandler = (data, callback) => {
  callback(data.statusCode);
};

const pingHandler = (data, callback) => {
  callback(data.statusCode, data.content);
};

const helloHandler = (data, callback) => {
  callback(data.statusCode, data.content);
};


module.exports.notFoundHandler = notFoundHandler;
module.exports.pingHandler = pingHandler;
module.exports.helloHandler = helloHandler;

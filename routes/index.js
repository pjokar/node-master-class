const { notFoundHandler, pingHandler, helloHandler } = require('../handlers');

// define router
module.exports.routes = {
  notFound: {
    statusCode: 404,
    content: null,
    handler: notFoundHandler
  },
  ping: {
    statusCode: 200,
    content: () => {return {foo: 'bar'}},
    handler: pingHandler
  },
  hello: {
    statusCode: 200,
    content: {message: "Hello Visitor!"},
    handler: helloHandler
  }
};


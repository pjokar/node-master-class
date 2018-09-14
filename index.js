// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// instantiate HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// start HTTP server
httpServer.listen(config.httpPort, () => {
  console.log("The server is listening on port " + config.httpPort);
});

const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};

// instantiate HTTPS server
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// start HTTPS server
httpsServer.listen(config.httpsPort, () => {
  console.log("The server is listening on port " + config.httpsPort);
});


// all server functions
const unifiedServer = (req, res) => {
  // get URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get query string
  const queryString = parsedUrl.query;

  // get http method
  const method = req.method.toLowerCase();

  // get headers
  const headers = req.headers;

  // get payload
  const decoder = new StringDecoder('utf-8');

  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // choose the right handler for this request OR call not found hanlder
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct data object to send to handler
    const data = {
      trimmedPath,
      queryString,
      method,
      headers,
      payload: buffer
    };

    // route the request to specified handler
    chosenHandler(data, (statusCode, payload) => {
      // use status code returned
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // use payload returned from handler or use empty object
      payload = typeof(payload) === 'object' ? payload : {};

      // convert payload to string
      const payloadAsString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadAsString);

      // log requested path
      console.log("Response: ", statusCode, payloadAsString);
    });



  });
};

// define handlers
let handlers = {};

// ping handler
handlers.ping = (data, callback) => {
  // callback status code 200
  callback(200);
};

// ping handler
handlers.hello = (data, callback) => {
  // callback status code 200
  callback(200, {message: "To infinity - and beyond!"});
};

// not found handler
handlers.notFound = (data, callback) => {
  // callback a status code
  callback(404);

};

// define router
const router = {
  hello: handlers.hello
};

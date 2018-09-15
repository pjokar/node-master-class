// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const { routes } = require('./routes');
const Router = require('./lib/Router');



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
const unifiedServer = (request, response) => {
  // get URL and parse it
  const parsedUrl = url.parse(request.url, true);

  // get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get payload
  const decoder = new StringDecoder('utf-8');

  let buffer = '';

  request.on('data', (data) => {
    buffer += decoder.write(data);
  });

  request.on('end', () => {
    buffer += decoder.end();

    // choose the right handler for this request OR call not found hanlder
    const router = new Router(routes);
    const route = router.getRoute(trimmedPath);

    route.execute(response);
  });
};




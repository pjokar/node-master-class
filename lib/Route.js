module.exports = class Route {
  constructor(routeConfig) {
    this.routeConfig = routeConfig;
  }

  getContent() {
    const content = this.routeConfig.content || {};

    if (typeof(this.routeConfig.content) === 'function') {
      return content();
    }

    return content;
  }

  getStatusCode() {
    return typeof(this.routeConfig.statusCode) === 'number' ? this.routeConfig.statusCode : 200;
  }

  execute(response) {

    const data = {
      content: this.getContent(),
      statusCode: this.getStatusCode()
    };

    this.routeConfig.handler(data, (statusCode, payload) => {
      // use payload returned from handler or use empty object
      payload = typeof(payload) === 'object' ? payload : {};

      // convert payload to string
      const payloadAsString = JSON.stringify(payload);

      response.setHeader('Content-Type', 'application/json');
      response.writeHead(statusCode);
      response.end(payloadAsString);

      // log requested path
      console.log("Response: ", statusCode, payloadAsString);
    });
  }

};

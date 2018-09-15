const Route = require('./Route');

module.exports = class Router {

  constructor(routes) {
    this.routes = routes;
  }

  getRouteConfig(requestedPath) {
    return typeof(this.routes[requestedPath]) !== 'undefined' ? this.routes[requestedPath] : this.routes['notFound'];
  }

  getRoute(requestedPath) {
    return new Route(this.getRouteConfig(requestedPath));
  }
};

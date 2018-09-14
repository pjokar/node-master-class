// create and export configuration variables

let environments = {};

// staging
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',

};


// production
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production'
};

// determine which environment was passed and command-lind argument
const config = typeof(process.env.NODE_ENV) === 'string' && typeof(environments[process.env.NODE_ENV.toLowerCase()]) === 'object'
  ? environments[process.env.NODE_ENV.toLowerCase()]
  : environments.staging;

module.exports = config;

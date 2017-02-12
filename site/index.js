const express = require('express'),
      bodyParser = require('body-parser'),
      FB = require('fb'),
      favicon = require('serve-favicon'),
      http = require('http'),
      morgan = require('morgan'),
      path = require('path'),
      session = require('express-session'),
      routes = require('./routes'),
      config = require('./secrets');

const requireInConfig = key => {
  const value = config[key];
  if (!value) {
    throw new Error(`${key} required in secrets.js`);
  } else {
    return value;
  }
};

const appId = requireInConfig('appId');
const appSecret = requireInConfig('appSecret');
const sessionSecret = requireInConfig('sessionSecret');
const redirectUri = requireInConfig('redirectUri');

// set fb options
const options = FB.options({
  appId: config.appId,
  appSecret: config.appSecret,
  redirectUri: config.redirectUri
});

const app = express();

// configure express
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/assets/favicon.ico'));
app.use(morgan('dev'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: sessionSecret
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

routes(app, appId);

http.createServer(app).listen(app.get('port'), () => {
  console.log("Express server listening on port " + app.get('port'));
});

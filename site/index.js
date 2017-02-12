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

const appId = config.appId;
if (!appId) {
  throw new Error("facebook appId required in secrets.js");
}

const appSecret = config.appSecret;
if (!appSecret) {
  throw new Error("facebook appSecret required in secrets.js");
}

const sessionSecret = config.sessionSecret;
if (!sessionSecret) {
  throw new Error("server sessionSecret required in secrets.js");
}

const redirectUri = config.redirectUri;
if (!redirectUri) {
  throw new Error("facebook redirectUri required in secrets.js");
}

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

routes(app);

http.createServer(app).listen(app.get('port'), () => {
  console.log("Express server listening on port " + app.get('port'));
});

const express = require('express'),
      bodyParser = require('body-parser'),
      FB = require('fb'),
      favicon = require('serve-favicon'),
      http = require('http'),
      morgan = require('morgan'),
      path = require('path'),
      Step = require('step'),
      session = require('express-session'),
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
  'appId': config.appId,
	'appSecret' : config.appSecret,
	'redirectUri': config.redirectUri
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

const index = (req, res) => {
  const accessToken = req.session.access_token;
  const loginUrl = FB.getLoginUrl({
    scope: 'user_friends, public_profile'
  });
  res.render('index', {
    appId,
    loginUrl,
    title: 'Pretty Good Messenger'
  });
};

const login_callback = (req, res, next) => {
  const code = req.query.code;

  if (req.query.error) {
    // user might have disallowed the app
    return res.status(400).send('login-error ' + req.query.error_description);
  } else if (!code) {
    return res.redirect('/');
  }

  Step(
    function exchangeCodeForAccessToken () {
      FB.napi('oauth/access_token', {
        client_id:      FB.options('appId'),
        client_secret:  FB.options('appSecret'),
        redirect_uri:   FB.options('redirectUri'),
        code:           code
      }, this);
    },
    function extendAccessToken (err, result) {
      if (err) throw err;
      FB.napi('oauth/access_token', {
        client_id:          FB.options('appId'),
        client_secret:      FB.options('appSecret'),
        grant_type:         'fb_exchange_token',
        fb_exchange_token:  result.access_token
      }, this);
    },
    function getFriends (err, result) {
      if (err) throw err;

      req.session.access_token = result.access_token;
      req.session.expires = result.expires || 0;

      const options = {
        access_token: req.session.access_token
      };
      FB.napi('/me/friends', 'get', options, this);
    },
    function getKeys (err, response) {
      if (err) throw err;
      const {
        friends
      } = response.data;
      const options = {
        access_token: req.session.access_token,
        fields: 'public_key'
      };
      const group = this.group();
      friends.forEach(user => {
        FB.napi('/' + user.id, options, (err, response) => {
          const key = {
            name: user.name,
            id: user.id,
            key: response.public_key
          };
          return group()(err, key);
        });
      });
    },
    function showKeys (err, keys) {
      if (err) throw err;
      console.log(keys);
      res.status(200).send(keys);
    }
  );
};

app.get('/', index);
app.get('/login/callback', login_callback);

http.createServer(app).listen(app.get('port'), () => {
  console.log("Express server listening on port " + app.get('port'));
});

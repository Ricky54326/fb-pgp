// get our secrets
// var secrets = require('./secrets.js');

var express       = require('express'),
    FB            = require('fb'),
    http          = require('http'),
    path          = require('path'),
    Step          = require('step'),
    config        = require('./secrets.js');


var app = express();

if(!config.app_id || !config.app_secret) {
  throw new Error('facebook app_id and app_secret required in secrets.js');
}

// set fb options
var options = FB.options({'appId': config.app_id,
			                    'appSecret' : config.app_secret,
			                    'redirectUri': config.redirectUri});


// configure express
app.configure(function() {
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.cookieSession({ secret: 'secret'}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

var root = function (req, res) {
  var accessToken = req.session.access_token;
  res.render('index', {
    title: 'Express',
    loginUrl: FB.getLoginUrl({ scope: 'user_friends, public_profile' })
  });
};

var login_callback = function (req, res, next) {
  var code            = req.query.code;

  if(req.query.error) {
    // user might have disallowed the app
    return res.send('login-error ' + req.query.error_description);
  } else if(!code) {
    return res.redirect('/');
  }

  Step(
    function exchangeCodeForAccessToken() {
      FB.napi('oauth/access_token', {
        client_id:      FB.options('appId'),
        client_secret:  FB.options('appSecret'),
        redirect_uri:   FB.options('redirectUri'),
        code:           code
      }, this);
    },
    function extendAccessToken(err, result) {
      if(err) throw(err);
      FB.napi('oauth/access_token', {
        client_id:          FB.options('appId'),
        client_secret:      FB.options('appSecret'),
        grant_type:         'fb_exchange_token',
        fb_exchange_token:  result.access_token
      }, this);
    },
    function (err, result) {
      if(err) return next(err);

      req.session.access_token    = result.access_token;
      req.session.expires         = result.expires || 0;

      FB.api('/me/friends', 'get', {access_token: req.session.access_token}, function(response) {
        console.log(response);
        var friends = response.data;

        console.log(friends);
        if (friends) {
          friends.map(function (user) {
            FB.api('/' + user.id, {access_token: req.session.access_token, fields: 'public_key'}, function(response2) {
              console.log(response2);
              var keys = {
                name: user.name,
                id: user.id,
                key: response2.public_key
              };
              console.log(keys);
              //res.send(keys);
            });
          });
        } else {
          res.send('Please log in again');
        }
      });
    }
  );
};

app.get( '/',                root);
app.get( '/login/callback',  login_callback);


http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});


// FB.api('oauth/access_token', {
//     client_id: config.app_id,
//     client_secret: config.app_secret,
//     grant_type: 'client_credentials'
// }, function (res) {
//     if(!res || res.error) {
//         console.log(!res ? 'error occurred' : res.error);
//         return;
//     }

//     var accessToken = res.access_token;
//     console.log(accessToken);



// });

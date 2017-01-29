// get our secrets
// var secrets = require('./secrets.js');

var express       = require('express'),
    FB            = require('fb'),
    http          = require('http'),
    path          = require('path'),

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
    app.set('port', process.env.PORT || 3000);
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
    if(!accessToken) {
        res.render('index', {
            title: 'Express',
            loginUrl: FB.getLoginUrl({ scope: 'user_friends, public_profile' })
        });
    } else {
        res.render('menu');
    }  
};

var login_callback = function (req, res, next) {
    console.log(req, res);
    res.send('wat');
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

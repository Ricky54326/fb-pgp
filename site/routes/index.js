const FB = require('fb');
const login_callback = require('./callback');
const getKeys = require('./getKeys');

const index = appId => (req, res) => {
  const loginUrl = FB.getLoginUrl({
    scope: 'user_friends, public_profile'
  });
  res.render('index', {
    appId,
    loginUrl,
    title: 'Pretty Good Messenger'
  });
};

module.exports = (app, appId) => {
  app.get('/', index(appId));
  app.get('/login/callback', login_callback);
  app.post('/keys', getKeys);
};

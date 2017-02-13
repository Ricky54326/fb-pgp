const FB = require('fb');
const login_callback = require('./callback');
const getKeys = require('./getKeys');

const index = appId => (req, res) => {
  const loginUrl = FB.getLoginUrl({
    scope: 'user_friends, public_profile'
  });
  res.send(JSON.stringify({ loginUrl }));
};

module.exports = (app, appId) => {
  app.get('/', index(appId));
  app.get('/login/callback', login_callback);
  app.get('/keys', getKeys);
};

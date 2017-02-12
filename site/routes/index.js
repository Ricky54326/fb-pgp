const login_callback = require('./callback');

const index = appId => (req, res) => {
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

module.exports = app => {
  app.get('/', index);
  app.get('/login/callback', login_callback);
};

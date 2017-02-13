const FB = require('fb');
const Step = require('step');

module.exports = (req, res, next) => {
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
      const friends = response.data;
      const options = {
        access_token: req.session.access_token,
        fields: 'public_key'
      };
      const group = this.group();
      friends.forEach(user => {
        FB.napi('/' + user.id, options, group());
      });
    },
    function showKeys (err, keys) {
      if (err) throw err;
      console.log(keys);
      res.status(200).send(keys);
    }
  );
};

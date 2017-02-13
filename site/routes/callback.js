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
    function setSession (err, result) {
      res.status(200).send(JSON.stringify({
        access_token,
        expires
      }));
    }
  );
};

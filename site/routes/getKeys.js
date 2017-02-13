const FB = require('fb');
const Step = require('step');

module.exports = (req, res, next) => {
  const { access_token } = req.body;
  if (!access_token) {
    res.status(400).send('Missing access token');
  } else {
    Step(
      function getFriends (err, result) {
        if (err) throw err;
        FB.napi('/me/friends', 'get', { access_token }, this);
      },
      function getKeys (err, response) {
        if (err) throw err;
        const friends = response.data;
        const options = {
          access_token,
          fields: 'public_key'
        };
        const group = this.group();
        friends.forEach(user => {
          FB.napi('/' + user.id, options, group());
        });
      },
      function showKeys (err, keys) {
        if (err) throw err;
        res.status(200).send(keys);
      }
    );
  }
}

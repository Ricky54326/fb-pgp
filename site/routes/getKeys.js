const FB = require('fb');
const Step = require('step');

module.exports = (req, res, next) => {
  const {
    session: {
      access_token,
      expires
    }
  } = req;
  Step(
    function getFriends (err, result) {
      if (err) throw err;

      const options = {
        access_token: access_token
      };
      FB.napi('/me/friends', 'get', options, this);
    },
    function getKeys (err, response) {
      if (err) throw err;
      const friends = response.data;
      const options = {
        access_token: access_token,
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

import * as openpgp from 'openpgp';
import {publicKey, privateKey} from './secrets';

console.log(openpgp);
console.log(fetch);

let options = {
    data: "Hello, world!",
    publicKeys: openpgp.key.readArmored(publicKey).keys,
    privateKeys: openpgp.key.readArmored(privateKey).keys
};

openpgp.encrypt(options).then(function(ciphertext) {
    let encrypted = ciphertext.data;
    console.log(encrypted);


    /* now test decrypt */
    let options = {
        message: openpgp.message.readArmored(encrypted),
        //publicKeys: openpgp.key.readArmored(publicKey).keys,
        privateKey: openpgp.key.readArmored(privateKey).keys[0]
    };


    openpgp.decrypt(options).then(function(plaintext) {
        console.log(plaintext.data);
    });


});


fetch('http://fb-pgp.com:8000/keys',
      {
          method: "post",
          body: JSON.stringify({
              access_token: undefined
          })
      })
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        console.log( response.json() );
    });




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {


});

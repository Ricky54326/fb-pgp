/* Get every message in the currently active Messenger tab */
function getAllMessages() {
    return document.getElementsByClassName("_58nk");
}

/* These are a special case message, markup, delimited by '''language ...code... '''  */
function getCodeSnippets() {
    return document.getElementsByClassName("_wu0");
};

function getEncryptedMessages() {
    return document.getElementsByClassName("enc");
};

function getDecryptedMessages() {
    return document.getElementsByClassName("dec");
};

function getUsername() {
    let profileURL = document.querySelectorAll("a._3oh-").innerHTML;
    return profileURL.substr(profileURL.lastIndexOf('/') + 1);
}

function getRealName() {
    return document.querySelectorAll("div._3eur")[0].children[0].innerHTML;
}



/* event loop to process all current messages */
function processMessages() {
    let messages = getAllMessages();

    console.log(messages);

    setInterval(function() {



    }, 1000);
}


//setTimeout(processMessages, 1000);

fetch("https://www.facebook.com/v2.0/dialog/oauth?response_type=code&scope=user_friends%2C%20public_profile&redirect_uri=http%3A%2F%2Ffb-pgp.com%3A8000%2Flogin%2Fcallback&client_id=231549833968712")
    .then(function (response) {
        console.log('fake text', response);
    });

// config.js

module.exports = {
    'baseURL': 'http://mycollectionsapp-server.au-syd.mybluemix.net/',
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl' : 'mongodb://localhost:27017/conFusion',
    'facebook': {
        clientID: '1575895849393383',
        clientSecret: '28f765ad426dff4c828c35e249e99a3a',
        callbackURL: 'http://mycollectionsapp-server.au-syd.mybluemix.net/users/facebook/callback'
    }    
}
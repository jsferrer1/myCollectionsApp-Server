// config.js

module.exports = {
    'baseURL': 'http://mycollectionsapp-server.au-syd.mybluemix.net/',
    'secretKey': '12345',
    'mongoUrl' : 'mongodb://localhost:27017/conFusion',
    'facebook': {
        clientID: '123',
        clientSecret: '456',
        callbackURL: 'http://mycollectionsapp-server.au-syd.mybluemix.net/users/facebook/callback'
    }    
}

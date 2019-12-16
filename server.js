const express = require('express');
const app = express();

let bodyParser = require('body-parser'),
auth = require('./modules/OAuth-Salesforce');

app.enable('trust proxy');

// setting the port
app.set('port', process.env.PORT || 5000);

app.get('/', (req, res) =>{
    res.send("heroku App")
})

//read about this
//app.use('/', express.static(__dirname + '/www')); // serving company logos after successful authentication

//read about this too
app.use(bodyParser.urlencoded({extended: true}));



// routing cases
let _case = require('./modules/case');

app.post('/login', auth.loginLink);
app.post('/logout', auth.logout);
app.get('/login/:slackUserId', auth.oauthLogin);
app.get('/oauthcallback', auth.oauthCallback);

// server listening
app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});

import bodyParser from 'body-parser';
import crypto from 'crypto';
import express from 'express';
import https from 'https';
import request from 'request';
import firebase from 'firebase';
import PrettyError from 'pretty-error';
import { APP_SECRET, FIRE_BASE } from 'app-config.js';

const pretty = new PrettyError();
const app = express();

// Firebase init
const firebaseApp = firebase.initializeApp(FIRE_BASE);

if (firebaseApp.options.apiKey === FIRE_BASE.apiKey) {
    console.log('==> 🛢 Firebase is connected 😉');
}

app.set('port', process.env.PORT || process.env.APIPORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', (req, res, next) => {
  console.log(req.originalUrl);
  next();
}, require('./routes/index'));

/* ERROR HANDLER */
app.use((error, req, res, next) => {
  if (error.code >= 500) console.error(pretty.render(error));
  else console.error(pretty.render(error.message));
  res.status(error.code || 500).json({
    code: error.code || 500,
    message: error.message
  });
  next();
});
/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
        // For testing, let's log an error. In production, you should throw an
        // error.
        console.error("Couldn't validate the signature.");
    } else {
        var elements = signature.split('=');
        var method = elements[0];
        var signatureHash = elements[1];

        var expectedHash = crypto.createHmac('sha1', APP_SECRET)
            .update(buf)
            .digest('hex');

        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
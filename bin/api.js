/**
 * Copyright 2017-present, Jobo App, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
import bodyParser from 'body-parser';
import crypto from 'crypto';
import express from 'express';
import https from 'https';
import request from 'request';
import firebase from 'firebase';
import firebaseAdmin from 'firebase-admin';
import favicon from 'serve-favicon';
import PrettyError from 'pretty-error';
// ===== MESSENGER =============================================================
import ThreadSetup from 'messenger-api-helpers/thread-setup';
// ===== APP CONFIG ============================================================
import { APP_SECRET, FIRE_BASE, FIRE_BASE_ADMIN } from 'app-config.js';
// ===== CONFIG PRETTY ERROR ===================================================
const pretty = new PrettyError();
const app = express();

app.set('port', process.env.PORT || process.env.APIPORT || 5000);
// ===== FIRE BASE INIT ========================================================
const firebaseApp = firebase.initializeApp(FIRE_BASE);

if (firebaseApp.options.apiKey === FIRE_BASE.apiKey) {
  console.log('==> 🛢 Firebase is connected 😉');
}
// ===== FIRE BASE ADMIN INIT ========================================================
const firebaseAdApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(FIRE_BASE_ADMIN),
  databaseURL: FIRE_BASE.databaseURL
});

/* ----------  Views  ---------- */

app.set('views', 'views');
app.set('view engine', 'jade');

/* ----------  Static Assets  ---------- */
app.use(express.static('public'));
app.use(favicon('public/icon.png'));

/* ----------  Parsers  ---------- */

app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', (req, res, next) => {
  console.log(req.originalUrl);
  next();
}, require('routes/index'));

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

/* ----------  Errors  ---------- */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res) {
  // set locals, only providing error in development
  if (err.code >= 500) console.error(pretty.render(error));
  else console.error(pretty.render(err.message));
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/* ----------  Messenger setup  ---------- */
ThreadSetup.setDomainWhitelisting();
ThreadSetup.setPersistentMenu();
ThreadSetup.setGetStarted();

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port')); // eslint-disable-line
});

export default app;

import express from 'express';
import uuid from 'uuid';

// ===== STORES ================================================================
import UserStore from '../stores/user_store';

const router = express.Router({
  mergeParams: true
}); // eslint-disable-line

const linkAccountToMessenger = (res, username, redirectURI) => {
  const authCode = uuid();

  UserStore.linkMessengerAccount(username, authCode);

  const redirectURISuccess = `${redirectURI}&authorization_code=${authCode}`;

  res.redirect(redirectURISuccess);
};

/**
 * GET Create user account view
 */
router.route('/create')
.get(function(req, res) {
  const accountLinkingToken = req.query.account_linking_token;
  const redirectURI = req.query.redirect_uri;

  res.render('create-account', {accountLinkingToken, redirectURI});
})
.post(function(req, res) {
  const {username, password, password2, redirectURI} = req.body;
  if (UserStore.has(username)) {
    res.render(
      'create-account',
      {
        username,
        password,
        password2,
        redirectURI,
        errorMessage: `Sorry! '${username}' has already been taken.`,
        errorInput: 'username',
      },
    );
  } else {
    UserStore.insert(username, password);

    if (redirectURI) {
      linkAccountToMessenger(res, username, redirectURI);
    } else {
      res.render('create-account-success', {username});
    }
  }
});

router.route('/login')
.get(function(req, res) {

  const accountLinkingToken = req.query.account_linking_token;

  const redirectURI = req.query.redirect_uri;

  res.render('login', {accountLinkingToken, redirectURI});
})
.post(function(req, res) {
  const {username, password, redirectURI} = req.body;
  const userLogin = UserStore.get(username);
  if (!userLogin || userLogin.password !== password) {
    res.render('login', {
      redirectURI,
      username,
      password,
      errorMessage: !userLogin
        ? 'Uh oh. That username doesn’t exist. Please use the demo account or try again.' // eslint-disable-line max-len
        : 'Oops. Incorrect password',
      errorInput: !userLogin ? 'username' : 'password',
    });
  } else {
    linkAccountToMessenger(res, userLogin.username, redirectURI);
  }
});

export default router;

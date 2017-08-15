import express from 'express';
import uuid from 'uuid';
import firebase, { auth, database } from 'firebase';
// ===== STORES ================================================================
import UserStore from 'stores/user_store';

const router = express.Router({
  mergeParams: true
}); // eslint-disable-line

const linkAccountToMessenger = (res, userId, redirectURI, addNew = false) => {
  const authCode = {
    userId,
    addNew
  };

  // UserStore.linkMessengerAccount(userId, authCode);

  const redirectURISuccess = `${redirectURI}&authorization_code=${userId}`;

  res.redirect(redirectURISuccess);
};

/**
 * GET Create user account view
 */
router.route('/create')
  .get(function (req, res) {
    const accountLinkingToken = req.query.account_linking_token;
    const redirectURI = req.query.redirect_uri;

    res.render('users/create-account', { accountLinkingToken, redirectURI });
  })
  .post(function (req, res) {
    const {
      username,
      password,
      password2,
      displayName,
      phone,
      birth,
      jobs,
      avatar,
      redirectURI
    } = req.body;
    if (UserStore.has(username)) {
      res.render(
        'users/create-account', {
          username,
          password,
          password2,
          displayName,
          phone,
          birth,
          jobs,
          avatar,
          redirectURI,
          errorMessage: `Xin lỗi! 'Tài khoản ${username}' đã tồn tại.`,
          errorInput: 'username',
        },
      );
    } else {
      UserStore.insert({ username, password, displayName, phone, birth })
        .then(user => {
          if (redirectURI) {
            linkAccountToMessenger(res, user.userId, redirectURI, true);
          } else {
            res.render('users/create-account-success', { displayName });
          }
        })
        .catch(err => {
          if (err.code === 'auth/email-already-in-use') {
            res.render(
              'users/create-account', {
                username,
                password,
                password2,
                displayName,
                phone,
                birth,
                jobs,
                avatar,
                redirectURI,
                errorMessage: `Xin lỗi! 'Tài khoản ${username}' đã tồn tại.`,
                errorInput: 'username',
              },
            );
          } else {
            res.render(
              'users/create-account', {
                username,
                password,
                password2,
                displayName,
                phone,
                birth,
                jobs,
                avatar,
                redirectURI,
                errorMessage: err.message,
                errorInput: 'username',
              },
            );
          }
        });
    }
  });

router.route('/login')
  .get(function (req, res) {
    const accountLinkingToken = req.query.account_linking_token;
    // UserStore.getByMessengerId(1747394891967196).then(user => console.log(user));
    const redirectURI = req.query.redirect_uri;
    res.render('users/login', { accountLinkingToken, redirectURI });
  })
  .post(function (req, res) {
    const { username, password, redirectURI } = req.body;
    auth().signInWithEmailAndPassword(username, password)
      .then(userLogin => {
        linkAccountToMessenger(res, userLogin.uid, redirectURI);
      })
      .catch(err => {
        res.render('users/login', {
          redirectURI,
          username,
          password,
          errorMessage: 'Tên tài khoản hoặc mật khẩu chưa đúng!',
          errorInput: 'username',
        });
      });
  });

export default router;
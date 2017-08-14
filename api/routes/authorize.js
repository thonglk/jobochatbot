import express from 'express';
const router = express.Router({
  mergeParams: true
}); // eslint-disable-line

/*
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL.
 *
 */
router.route('/')
  .get((req, res, next) => {
    const username = req.query.username;
    const password = req.query.password;
    const redirectURI = req.query.redirect_uri;
    // Authorization Code should be generated per user by the developer. This will
    // be passed to the Account Linking callback.
    const authCode = "1234567890";



    // Redirect users to this URI on successful login
    const redirectURISuccess = redirectURI + "&authorization_code=" + authCode +
      "&username=" + username +
      "&password=" + password;

    res.render('authorize', {
      username: username,
      redirectURI: redirectURI,
      redirectURISuccess: redirectURISuccess
    });
  })
  .post((req, res, next) => {
    console.log(req);
  });

module.exports = router;
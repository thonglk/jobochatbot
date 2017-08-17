import express from 'express';
const router = express.Router({mergeParams: true}); // eslint-disable-line

router.use('/webhook', require('./webhook'));
router.use('/users', require('./users'));
router.route('/help')
.get((req, res, next) => {
  res.render('help/help');
});

module.exports = router;

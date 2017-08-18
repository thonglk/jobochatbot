import express from 'express';
const router = express.Router({mergeParams: true}); // eslint-disable-line

router.use('/webhook', require('./webhook'));
router.use('/noti', require('./notification'));
router.use('/users', require('./users'));
router.use('/help', (req, res, next) => {
  res.render('help/help');
});

module.exports = router;

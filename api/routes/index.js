import express from 'express';
const router = express.Router({mergeParams: true}); // eslint-disable-line

router.use('/webhook', require('./webhook'));
router.use('/authorize', require('./authorize'));
router.use('/users', require('./users'));

module.exports = router;

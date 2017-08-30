import express from 'express';
import sendApi from 'messenger-api-helpers/send';
// ===== STORES ================================================================
import UserStore from 'stores/user_store';
import DATA from 'config/data-config';

const router = express.Router({
  mergeParams: true
}); // eslint-disable-line

router.route('/')
  .get((req, res, next) => {
    res.json(DATA);
  })
  .post((req, res, next) => {
    const { messages, recipientIds } = req.body;

    if (recipientIds && recipientIds !== 'all') {
      // recipientIds.forEach(recipientId => {
      sendApi.sendNotification(recipientIds, messages);
      // });
    } else {
      UserStore.getMessengerIds()
        .then(messengerIds => sendApi.sendNotification(messengerIds, messages))
        .catch(err => res.status(err.state).send(err));
    }
    res.sendStatus(200);
  });

module.exports = router;
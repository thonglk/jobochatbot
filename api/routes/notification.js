import express from 'express';
import sendApi from 'messenger-api-helpers/send';
// ===== STORES ================================================================
import UserStore from 'stores/user_store';

const router = express.Router({
  mergeParams: true
}); // eslint-disable-line

router.route('/')
  .get((req, res, next) => {
    // UserStore.updateConversations('1321', {dfdfd: '43234'})
    // .then(() => res.status(200).send('123'));
    UserStore.getLastedConversation('1747394891967196')
    .then(data => res.status(200).json(data['1503045539254'].send));
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
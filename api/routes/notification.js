import express from 'express';
import sendApi from 'messenger-api-helpers/send';
// ===== STORES ================================================================
import UserStore from 'stores/user_store';

const router = express.Router({
  mergeParams: true
}); // eslint-disable-line

router.route('/')
  // .get((req, res, next) => {
  //   res.json(DATA);
  // })
  .post((req, res, next) => {
    const { messages, recipientIds } = req.body;
    const messageToSend = [];
    if (messages.text && messages.calltoaction && messages.linktoaction) {
      const buttonMessage = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": messages.text,
            "buttons": [{
              type: 'web_url',
              title: messages.calltoaction,
              url: messages.linktoaction,
              webview_height_ratio: 'tall',
              messenger_extensions: true,
            }]
          }
        }
      };
      messageToSend.push(buttonMessage);
    } else {
      if (messages.text) {
        const textMessage = {
          "text": messages.text
        }
        messageToSend.push(textMessage);
      }
    }

    if (messages.image) {
      const imageMessage = {
        "attachment": {
          "type": "image",
          "payload": {
            "url": messages.image
          }
        }
      }
      messageToSend.push(imageMessage);
    }

    console.log(messageToSend);
    if (recipientIds && recipientIds !== 'all') {
      sendApi.sendNotification(recipientIds, messageToSend);
    } else {
      UserStore.getMessengerIds()
        .then(messengerIds => sendApi.sendNotification(messengerIds, messageToSend))
        .catch(err => res.status(err.state).send(err));
    }
    res.sendStatus(200);
  });

module.exports = router;
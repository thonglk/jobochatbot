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
    let messageToSend = [];
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
              messenger_extensions: false,
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

    if (!messages.text && !messages.image &&
      !messages.calltoaction && !messages.linktoaction) messageToSend = messages;

    if (recipientIds && recipientIds !== 'all') {
      sendApi.sendNotification(recipientIds, messageToSend);
      res.sendStatus(200);
    } else {
      UserStore.getMessengerIds()
        .then(messengerIds => {
          sendApi.sendNotification(messengerIds, messageToSend);
          res.sendStatus(200);
        })
        .catch(err => res.status(err.state).send(err));
    }
  });

module.exports = router;
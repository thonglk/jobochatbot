import express from 'express';
import {
  VALIDATION_TOKEN,
} from 'app-config';

// ===== MESSENGER =============================================================
import receiveApi from 'messenger-api-helpers/receive';
const router = express.Router({
  mergeParams: true
}); // eslint-disable-line

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
router.route('/')
  .get(function (req, res, next) {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
      console.log("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);
    }
  })
  .post(function (req, res, next) {
    res.sendStatus(200);

    const data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach((pageEntry) => {
        if (!pageEntry.messaging) {
          return;
        }
        // Iterate over each messaging event
        pageEntry.messaging.forEach((messagingEvent) => {
          console.log('Message event: ', { messagingEvent });
          if (messagingEvent.optin) {
            receiveApi.handleReceivedAuthentication(messagingEvent);
          } else if (messagingEvent.message) {
            receiveApi.handleReceiveMessage(messagingEvent);
          } else if (messagingEvent.delivery) {
            receiveApi.handleReceivedDeliveryConfirmation(messagingEvent);
          } else if (messagingEvent.read) {
            receiveApi.handleReceivedMessageRead(messagingEvent);
          } else if (messagingEvent.account_linking) { // eslint-disable-line camelcase, max-len
            receiveApi.handleReceiveAccountLink(messagingEvent);
          } else if (messagingEvent.postback) {
            receiveApi.handleReceivePostback(messagingEvent);
          } else {
            console.error(
              'Webhook received unknown messagingEvent: ',
              messagingEvent
            );
          }
        });
      });
    }
  });

module.exports = router;
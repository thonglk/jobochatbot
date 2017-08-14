import express from 'express';
import {
  VALIDATION_TOKEN,
} from 'app-config';
import {
  receivedAuthentication,
  receivedMessage,
  receivedPostback,
  receivedAccountLink,
  receivedDeliveryConfirmation,
  receivedMessageRead
} from 'services/webhook-services';

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
  .get((req, res, next) => {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
      console.log("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);
    }
  })
  .post((req, res, next) => {
    const data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(function (pageEntry) {
        var pageID = pageEntry.id;
        var timeOfEvent = pageEntry.time;

        // // Iterate over each messaging event
        // pageEntry.messaging.forEach(function (messagingEvent) {
        //   if (messagingEvent.optin) {
        //     receivedAuthentication(messagingEvent);
        //   } else if (messagingEvent.message) {
        //     receivedMessage(messagingEvent);
        //   } else if (messagingEvent.delivery) {
        //     receivedDeliveryConfirmation(messagingEvent);
        //   } else if (messagingEvent.postback) {
        //     receivedPostback(messagingEvent);
        //   } else if (messagingEvent.read) {
        //     receivedMessageRead(messagingEvent);
        //   } else if (messagingEvent.account_linking) {
        //     receivedAccountLink(messagingEvent);
        //   } else {
        //     console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        //   }
        // });
      });

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know you've
      // successfully received the callback. Otherwise, the request will time out.
      res.sendStatus(200);
    }
  });

module.exports = router;
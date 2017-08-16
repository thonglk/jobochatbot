/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MESSENGER =============================================================
import sendApi from './send';

// ===== STORES ================================================================
import UserStore from 'stores/user_store';
import textMessage from 'stores/text-messages';
import axios from 'axios';
import { CONFIG } from 'app-config';

const handleReceivedAuthentication = (event) => {
  const senderId = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfAuth = event.timestamp;

  // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
  // The developer can set this to an arbitrary value to associate the
  // authentication callback with the 'Send to Messenger' click event. This is
  // a way to do account linking when the user clicks the 'Send to Messenger'
  // plugin.
  const passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderId, recipientID, passThroughParam,
    timeOfAuth);

  // When an authentication is received, we'll send a message back to the sender
  // to let them know it was successful.
  sendApi.sendMessage(senderId, [{
    text: textMessage.authentication
  }]);
}

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
const handleReceivedDeliveryConfirmation = (event) => {
  const senderId = event.sender.id;
  const recipientID = event.recipient.id;
  const delivery = event.delivery;
  const messageIDs = delivery.mids;
  const watermark = delivery.watermark;
  const sequenceNumber = delivery.seq;

  if (messageIDs) {
    messageIDs.forEach(function (messageID) {
      console.log("Received delivery confirmation for message ID: %s",
        messageID);
    });
  }

  console.log("All message before %d were delivered.", watermark);
}

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 *
 */
const handleReceivedMessageRead = (event) => {
  const senderId = event.sender.id;
  const recipientID = event.recipient.id;

  // All messages before watermark (a timestamp) or sequence have been seen.
  const watermark = event.read.watermark;
  const sequenceNumber = event.read.seq;

  console.log("Received message read event for watermark %d and sequence " +
    "number %d", watermark, sequenceNumber);
}

/*
 * Account Link Event - This event is called when the Link Account
 * or Unlink Account action has been tapped. Read More at:
 * https://developers.facebook.com/docs/messenger-platform/
 * webhook-reference/account-linking
 */
const handleReceiveAccountLink = (event) => {
  const senderId = event.sender.id;

  /* eslint-disable camelcase */
  const status = event.account_linking.status;
  const userId = event.account_linking.authorization_code;
  /* eslint-enable camelcase */
  // const userId = authCode.userId;
  console.log('Received account link event with for user %d with status %s ' +
    'and user id %s ', senderId, status, userId);

  switch (status) {
  case 'linked':
    UserStore.linkMessengerAccount(userId, senderId)
      .then(linkedUser => {
        // if (addNew) sendApi.sendSignUpSuccessMessage(senderId);
        sendApi.sendSignInSuccessMessage(senderId, linkedUser.name);
      })
      .catch(err => {
        console.log(err);
        sendApi.sendMessage(
          senderId, [{
            text: textMessage.loginFail
          }]);
      });
    break;
  case 'unlinked':
    UserStore.unlinkMessengerAccount(senderId)
      .then(status => {
        status ? sendApi.sendSignOutSuccessMessage(senderId) : sendApi.sendMessage(
          senderId, [{
            text: textMessage.logoutFail
          }]);
      });
    break;
  default:
    break;
  }
};

/*
 * handleReceivePostback — Postback event handler triggered by a postback
 * action you, the developer, specify on a button in a template. Read more at:
 * developers.facebook.com/docs/messenger-platform/webhook-reference/postback
 */
const handleReceivePostback = (event) => {
  /**
   * The 'payload' param is a developer-defined field which is
   * set in a postbackbutton for Structured Messages.
   *
   * In this case we've defined our payload in our postback
   * actions to be a string that represents a JSON object
   * containing `type` and `data` properties. EG:
   */
  const { type } = JSON.parse(event.postback.payload);
  const senderId = event.sender.id;

  // Perform an action based on the type of payload received.
  // Handle postback type
  switch (type) {
  case 'GET_STARTED':
    sendApi.sendWelcomeMessage(senderId);
    break;
  default:
    console.error(`Unknown Postback called: ${type}`);
    break;
  }
};

/*
 * handleReceiveMessage - Message Event called when a message is sent to
 * your page. The 'message' object format can vary depending on the kind
 * of message that was received. Read more at: https://developers.facebook.com/
 * docs/messenger-platform/webhook-reference/message-received
 */
const handleReceiveMessage = (event) => {
  const message = event.message;
  const senderId = event.sender.id;
  const recipientId = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const messageText = message.text ? sendApi.vietnameseDecode(message.text) : message.text;
  const messageAttachments = message.attachments;
  const quickReply = message.quick_reply;


  console.log("Received message for user %d and page %d at %d with message:",
    senderId, recipientId, timeOfMessage);
  console.log(JSON.stringify(message));

  const isEcho = message.is_echo;
  const messageId = message.mid;
  const appId = message.app_id;
  const metadata = message.metadata;
  // It's good practice to send the user a read receipt so they know
  // the bot has seen the message. This can prevent a user
  // spamming the bot if the requests take some time to return.
  sendApi.sendReadReceipt(senderId);
  // Handle text message
  if (messageText) {
    if (messageText === 'TIM VIEC' || messageText === 'JOB' || messageText === 'VIEC LAM' || messageText === 'CONG VIEC') {
      sendApi.sendQuickReplyFindJobs(senderId);
    } else if (messageText === 'DIA CHI' || messageText === 'LOCATION' || messageText === 'VI TRI' || messageText === 'ADDRESS') {
      sendApi.sendQuickReplyAddress(senderId);
    } else {
      sendApi.sendReturnMessage(senderId);
    }
  }
  // Handle attachment message
  if (messageAttachments) {
    if (messageAttachments[0] && messageAttachments[0].payload && messageAttachments[0].payload.coordinates) {
      const location = messageAttachments[0].payload.coordinates
      // const url = `${CONFIG.APIURL}/dash/job?lat=${location.lat}&lng=${location.long}`;
      const url = 'https://jobohihi.herokuapp.com/dash/job?lat=10.7871254&lng=106.6755164';
      let body = '';
      axios.get(url)
        .then(function (res) {
          console.log('data', res);
          console.log('lengthhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh12973y1827uhasjdnalkjsndjansdnknkanjskdn', res.length);
          if (res) {
            sendApi.sendMessage(senderId, [{
              text: textMessage.locationFound(res.length)
            }])
            sendApi.sendGenericJobMessage(senderId, res);
          } else {
            sendApi.sendMessage(senderId, [{
              text: textMessage.locationNotFound
            }]);
          }
        })
        .catch(function (error) {
          console.log('Got error', error);
        });

    } else {
      sendApi.sendMessage(senderId, [{
        text: textMessage.unknowAttachment
      }]);
    }
  }
};

export default {
  handleReceiveAccountLink,
  handleReceiveMessage,
  handleReceivePostback,
  handleReceivedMessageRead,
  handleReceivedDeliveryConfirmation,
  handleReceivedAuthentication,
};
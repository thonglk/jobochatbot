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
import firebase, { auth } from 'firebase';
import firebaseAdmin, { database } from 'firebase-admin';

// ==== CONFIG ============================================================
import DATA from 'config/data-config';
import { APIURL } from 'config/app-config';

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

  // database().ref('testBot').set(event);
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
        if (status) {
          auth()
            .signOut()
            .then(() => {
              return sendApi.sendSignOutSuccessMessage(senderId);
            })
            .catch(err => console.log(err));
        } else {
          sendApi.sendMessage(senderId, [{
            text: textMessage.logoutFail
          }]);
        }
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
    // sendApi.sendWelcomeMessage(senderId);
    UserStore.updateConversations(senderId)
      .then(() => sendApi.sendWelcomeMessage(senderId));
    break;
  case 'LOG_OUT':
    UserStore.unlinkMessengerAccount(senderId)
      .then(status => {
        if (status) {
          auth()
            .signOut()
            .then(() => {
              return sendApi.sendSignOutSuccessMessage(senderId, event);
            })
            .catch(err => console.log(err));
        } else {
          sendApi.sendMessage(senderId, [{
            text: textMessage.logoutFail
          }], event, 'text-bot');
        }
      });
    break;
  case 'CHOSE_JOB':
    sendApi.sendQuickReplyFindJobs(senderId, event);
    break;
  case 'LOCATION':
    sendApi.sendQuickReplyAddress(senderId, event);
    break;
  case 'PHONE_FALSE':
    sendApi.sendComfirmPhone(senderId, event);
    break;
  case 'PHONE_TRUE':
    const { phone } = JSON.parse(event.postback.payload).data;
    axios.get(`${APIURL}/checkUser?q=${phone}`)
      .then(users => {
        if (users.data.length > 0) {
          UserStore.updateMessengerByPhone(senderId, phone, users.data[0].userId).then(() => sendApi.sendWelcomeByPhone(senderId, users.data[0].name), event);
        } else sendApi.sendNotFoundPhone(senderId, event);
      })
      .catch(err => console.log(err));
    break;

  case 'EMAIL_FALSE':
    sendApi.sendComfirmEmail(senderId, event);
    break;
  case 'EMAIL_TRUE':
    const { email } = JSON.parse(event.postback.payload).data;
    axios.get(`${APIURL}/checkUser?q=${email}`)
      .then(users => {
        if (users.data.length > 0) {
          UserStore.updateMessengerByPhone(senderId, email, users.data[0].userId).then(() => sendApi.sendWelcomeByPhone(senderId, users.data[0].name), event);
        } else sendApi.sendNotFoundEmail(senderId, event);
      })
      .catch(err => console.log(err));
    break;
  default:
    console.error(`Unknown Postback called: ${type}`);
    break;
  }
};

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
    if (messageText === 'TIM VIEC' || messageText === 'JOB' || messageText === 'VIEC LAM' || messageText === 'CONG VIEC' || messageText === 'CHON NGANH NGHE') {
      sendApi.sendQuickReplyFindJobs(senderId, message);
    } else if (messageText === 'DIA CHI' || messageText === 'LOCATION' || messageText === 'VI TRI' || messageText === 'ADDRESS' || messageText === 'VIEC O GAN') {
      sendApi.sendQuickReplyAddress(senderId, message);
    } else if (messageText.match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g)) {
      sendApi.sendAcceptEmail(senderId, messageText.toLowerCase().match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g)[0], message);
    } else if (messageText.match(/[0-9]{0,13}/g)[0]) {
      if (!messageText.match(/[0-9]{10,11}/g)) {
        sendApi.sendMessage(senderId, [{
          text: textMessage.phoneFormatErr
        }], message, 'text-bot');
      } else {
        sendApi.sendAcceptPhone(senderId, messageText.match(/[0-9]{10,11}/g)[0].replace(/^0/g, ''), message);
      }
    } else {
      sendApi.sendReturnMessage(senderId, message, 'text-admin');
    }
  }
  // Handle attachment message
  if (messageAttachments) {
    if (messageAttachments[0] && messageAttachments[0].payload && messageAttachments[0].payload.coordinates) {
      const location = messageAttachments[0].payload.coordinates
      const url = `${APIURL}/dash/job?lat=${location.lat}&lng=${location.long}`;
      let body = '';
      axios.get(url)
        .then(function (res) {
          if (res) {
            const data = res.data;
            sendApi.sendMessage(senderId, [{
              text: textMessage.locationFound(data.length)
            }], message, 'location-bot')
            sendApi.sendGenericJobMessage(senderId, data);
          } else {
            sendApi.sendMessage(senderId, [{
              text: textMessage.locationNotFound
            }], message, 'location-bot');
          }
        })
        .catch(function (error) {
          console.log('Got error', error);
        });

    } else {
      sendApi.sendReturnMessage(senderId, message, 'attachment-admin');
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
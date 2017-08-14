import {
  CONFIG,
  VALIDATION_TOKEN,
  PAGE_ACCESS_TOKEN,
  SERVER_URL,
} from 'app-config';
import {
  sendTextMessage,
  callSendAPI
} from 'services/message-services';
/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to
 * Messenger" plugin, it is the 'data-ref' field. Read more at
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
export function receivedAuthentication(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfAuth = event.timestamp;

  // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
  // The developer can set this to an arbitrary value to associate the
  // authentication callback with the 'Send to Messenger' click event. This is
  // a way to do account linking when the user clicks the 'Send to Messenger'
  // plugin.
  const passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderID, recipientID, passThroughParam,
    timeOfAuth);

  // When an authentication is received, we'll send a message back to the sender
  // to let them know it was successful.
  sendTextMessage(senderID, "Authentication successful");
}

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
export function receivedMessage(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  const isEcho = message.is_echo;
  const messageId = message.mid;
  const appId = message.app_id;
  const metadata = message.metadata;

  // You may get a text or attachment but not both
  const messageText = message.text;
  const messageAttachments = message.attachments;
  const quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s",
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    const quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s",
      messageId, quickReplyPayload);

    sendTextMessage(senderID, "Quick reply tapped");
    return;
  }

  if (messageText) {
    // Handle message
    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
    case 'tìm việc':
      sendQuickReply_Timviec(senderID);
      break;
    case 'địa chỉ?':
      sendQuickReply_Diachi(senderID);
      break;
    default:
      sendTextMessage(senderID, 'Hiu hiu, thật ra mình không được thông minh cho lắm');
      setTimeout(function () {
        sendTextMessage(senderID, 'nhưng mình có thể tìm việc xung quanh bạn đó');
      }, 1000)

      setTimeout(function () {
        sendQuickReply_Diachi(senderID);
      }, 2000)

    }
  } else if (messageAttachments) {
    if (messageAttachments[0] && messageAttachments[0].payload && messageAttachments[0].payload.coordinates) {
      const location = messageAttachments[0].payload.coordinates
      const url = `${CONFIG.APIURL}dash/job?lat=${location.lat}&lng=${location.long}`;

      https.get(url, function (response) {
        let body = '';
        response.on('data', function (chunk) {
          body += chunk;
        });

        response.on('end', function () {
          const res = JSON.parse(body)
          console.log('body', res.data)
          if (res.total > 0) {
            sendTextMessage(senderID, "Chúng tôi đã tìm thấy " + res.total + " công việc đang tuyển xung quanh bạn")
            sendGenericMessage_Job(senderID, res.data);
          } else {
            sendTextMessage(senderID, "Hiện tại chúng tôi chưa cập nhật tại vị trí này");
          }

        });

      }).on('error', function (e) {
        console.log("Got error: " + e.message);
      });

    } else {
      sendTextMessage(senderID, "Chúng tôi đã nhận được thông tin bạn cung cấp");

    }
  }
}

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
export function receivedDeliveryConfirmation(event) {
  const senderID = event.sender.id;
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
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
export function receivedPostback(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  const payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful

  sendTextMessage(senderID, "Xin chào, cám ơn bạn đã sử dụng Jobo,")
  setTimeout(function () {
    sendQuickReply_DangKy(senderID);
  }, 500);
}

function sendQuickReply_DangKy(recipientId) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Để có thể tìm việc trên JOBO App bạn cần phải có tài khoản, bạn đã có tài khoản chưa?",
      quick_replies: [{
          "content_type": "text",
          "title": "Chưa (Tạo mới)",
          "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACNO"
        },
        {
          "content_type": "text",
          "title": "Có rồi (Đăng nhập)",
          "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACYES"
        }
      ]
    }
  };

  callSendAPI(messageData);
}

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 *
 */
export function receivedMessageRead(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;

  // All messages before watermark (a timestamp) or sequence have been seen.
  const watermark = event.read.watermark;
  const sequenceNumber = event.read.seq;

  console.log("Received message read event for watermark %d and sequence " +
    "number %d", watermark, sequenceNumber);
}

/*
 * Account Link Event
 *
 * This event is called when the Link Account or UnLink Account action has been
 * tapped.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
 *
 */
export function receivedAccountLink(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;

  const status = event.account_linking.status;
  const authCode = event.account_linking.authorization_code;

  console.log("Received account link event with for user %d with status %s " +
    "and auth code %s ", senderID, status, authCode);
}

function sendGenericMessage_Job(recipientId, data) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: CONFIG.data.job[data[0].job] + ' ' + CONFIG.data.working_type[data[0].working_type],
            subtitle: data[0].storeName + " - " + data[0].distance + " km",
            item_url: "https://www.joboapp.com/view/store/" + data[0].storeId,
            image_url: data[0].avatar,
            buttons: [{
              type: "web_url",
              url: "https://www.joboapp.com/view/store/" + data[0].storeId,
              title: "Xem chi tiết để ứng tuyển"
            }]
          }, {
            title: CONFIG.data.job[data[1].job] + ' ' + CONFIG.data.working_type[data[1].working_type],
            subtitle: data[1].storeName + " - " + data[1].distance + " km",
            item_url: "https://www.joboapp.com/view/store/" + data[1].storeId,
            image_url: data[1].avatar,
            buttons: [{
              type: "web_url",
              url: "https://www.joboapp.com/view/store/" + data[1].storeId,
              title: "Chi tiết"
            }]
          }, {
            title: CONFIG.data.job[data[2].job] + ' ' + CONFIG.data.working_type[data[2].working_type],
            subtitle: data[2].storeName + " - " + data[2].distance + " km",
            item_url: "https://www.joboapp.com/view/store/" + data[2].storeId,
            image_url: data[2].avatar,
            buttons: [{
              type: "web_url",
              url: "https://www.joboapp.com/view/store/" + data[2].storeId,
              title: "Chi tiết"
            }]
          }, {
            title: CONFIG.data.job[data[3].job] + ' ' + CONFIG.data.working_type[data[3].working_type],
            subtitle: data[3].storeName + " - " + data[3].distance + " km",
            item_url: "https://www.joboapp.com/view/store/" + data[3].storeId,
            image_url: data[3].avatar,
            buttons: [{
              type: "web_url",
              url: "https://www.joboapp.com/view/store/" + data[3].storeId,
              title: "Chi tiết"
            }]
          }, {
            title: CONFIG.data.job[data[4].job] + ' ' + CONFIG.data.working_type[data[4].working_type],
            subtitle: data[4].storeName + " - " + data[4].distance + " km",
            item_url: "https://www.joboapp.com/view/store/" + data[4].storeId,
            image_url: data[4].avatar,
            buttons: [{
              type: "web_url",
              url: "https://www.joboapp.com/view/store/" + data[4].storeId,
              title: "Chi tiết"
            }]
          }, {
            title: CONFIG.data.job[data[5].job] + ' ' + CONFIG.data.working_type[data[5].working_type],
            subtitle: data[5].storeName + " - " + data[5].distance + " km",
            item_url: "https://www.joboapp.com/view/store/" + data[5].storeId,
            image_url: data[5].avatar,
            buttons: [{
              type: "web_url",
              url: "https://www.joboapp.com/view/store/" + data[5].storeId,
              title: "Chi tiết"
            }]
          }, {
            title: "Xem thêm tại Joboapp.com",
            item_url: "https://www.joboapp.com/",
            image_url: SERVER_URL + '/public/assets/like.png',
            buttons: [{
              type: "web_url",
              url: "https://www.joboapp.com",
              title: "Xem chi tiết"
            }]

          }]

        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendQuickReply_Timviec(recipientId) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Bạn muốn tìm việc gì?",
      quick_replies: [{
          "content_type": "text",
          "title": "PG",
          "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
        },
        {
          "content_type": "text",
          "title": "Phục vụ",
          "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
        },
        {
          "content_type": "text",
          "title": "Lễ tân",
          "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        }
      ]
    }
  };

  callSendAPI(messageData);
}

function sendQuickReply_Diachi(recipientId) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Hãy gửi địa chỉ của bạn, mình sẽ tìm việc xung quanh đó cho bạn",
      quick_replies: [{
        content_type: "location"
      }]
    }
  };

  callSendAPI(messageData);
}
// ===== LODASH ================================================================
import castArray from 'lodash/castArray';
import isEmpty from 'lodash/isEmpty';
import textMessages from 'stores/text-messages';

// ===== MESSENGER =============================================================
import api from './api';
import messages from './messages';
// import { CONFIG } from 'app-config';

// ===== STORES ================================================================
import UserStore from 'stores/user_store';

// Turns typing indicator on.
const typingOn = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on', // eslint-disable-line camelcase
  };
};

// Turns typing indicator off.
const typingOff = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_off', // eslint-disable-line camelcase
  };
};

// Wraps a message json object with recipient information.
const messageToJSON = (recipientId, messagePayload) => {
  return {
    recipient: {
      id: recipientId,
    },
    message: messagePayload,
  };
};

// Send one or more messages using the Send API.
const sendMessage = (recipientId, messagePayloads, message = 'Unknow', type = 'message-admin') => {
  const messagePayloadArray = castArray(messagePayloads)
    .map((messagePayload) => messageToJSON(recipientId, messagePayload));

  api.callMessagesAPI(
    [
      typingOn(recipientId),
      ...messagePayloadArray,
      typingOff(recipientId),
    ]);
  UserStore.updateConversations(recipientId, message, messagePayloadArray, type)
    .then(result => console.log(result));
};

// Send one or more messages using the Send API.
const sendNotification = (recipientIds, messagePayloads) => {
  const messagePayloadArray = castArray(recipientIds)
    .map(recipientId => castArray(messagePayloads).map((messagePayload) => messageToJSON(recipientId, messagePayload)));
  messagePayloadArray.forEach(messagePayload =>
    api.callMessagesAPI(
      [
        ...messagePayload,
      ]));
};
// Send a welcome message for a non signed-in user.
const sendLoggedOutWelcomeMessage = (recipientId, message) => {
  // sendMessage(
  //   recipientId, [
  //     {
  //       text: textMessages.askPhone
  //     }
  //   ],
  //   message,
  //   'text-bot'
  // );
};

// Send a welcome message for a non signed-in user.
const sendGetStartWelcomeMessage = (recipientId) => {
  sendMessage(
    recipientId, [{
        text: textMessages.welcome,
      },
      {
        text: textMessages.askPhone
      }
    ],
    'Get Started',
    'text-bot'
  );
};
// Send a welcome message for a signed in user.
const sendLoggedInWelcomeMessage = (recipientId, username, message) => {
  sendMessage(
    recipientId, [
      messages.loggedInMessage(username),
    ], message, 'attachment-bot');
};

const sendAcceptPhone = (recipientId, phone, message) => {
  UserStore.checkMessengerId(recipientId)
    .then(userProfile => {
      if (!userProfile) {
        sendMessage(recipientId, [{
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "button",
              "text": "Số điện thoại của bạn là 0" + phone,
              "buttons": [{
                  type: 'postback',
                  title: 'Đúng',
                  payload: JSON.stringify({
                    type: 'PHONE_TRUE',
                    data: {
                      phone: phone,
                    },
                  }),
                },
                {
                  type: 'postback',
                  title: 'Sai',
                  payload: JSON.stringify({
                    type: 'PHONE_FALSE',
                    data: {
                      phone: phone,
                    },
                  }),
                }
              ]
            }
          }
        }], message, 'template-bot');
      } else {
        sendLoggedOutWelcomeMessage(recipientId, message);
      }
    });
};

const sendAcceptEmail = (recipientId, email, message) => {
  UserStore.checkMessengerId(recipientId)
    .then(userProfile => {
      if (!userProfile) {
        sendMessage(recipientId, [{
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "button",
              "text": "Email của bạn là " + email,
              "buttons": [{
                  type: 'postback',
                  title: 'Đúng',
                  payload: JSON.stringify({
                    type: 'EMAIL_TRUE',
                    data: {
                      email: email,
                    },
                  }),
                },
                {
                  type: 'postback',
                  title: 'Sai',
                  payload: JSON.stringify({
                    type: 'EMAIL_FALSE',
                    data: {
                      email: email,
                    },
                  }),
                }
              ]
            }
          }
        }], message, 'template-bot');
      } else {
        sendLoggedOutWelcomeMessage(recipientId, message);
      }
    });
};

const sendComfirmPhone = (recipientId, message) => {
  sendMessage(recipientId, [{
    text: 'Nhập lại số điện thoại'
  }], message, 'text-bot');
};

const sendComfirmEmail = (recipientId, message) => {
  sendMessage(recipientId, [{
    text: 'Nhập lại Email'
  }], message, 'text-bot');
};

const sendWelcomeByPhone = (recipientId, displayName, message) => {

  sendMessage(recipientId, [{
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": `Xin chào ${displayName}\nTôi có thể giúp gì cho bạn?`,
        "buttons": [{
            type: 'postback',
            title: 'Chọn công việc',
            payload: JSON.stringify({
              type: 'CHOSE_JOB',
            }),
          },
          {
            type: 'postback',
            title: 'Tìm theo vị trí',
            payload: JSON.stringify({
              type: 'LOCATION',
            }),
          }
        ]
      }
    }
  }], message, 'template-bot');
};

const sendNotFoundPhone = (recipientId, message) => {
  sendMessage(recipientId, [{
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": textMessages.phoneNotRegistered,
        "buttons": [{
            type: 'web_url',
            title: 'Đăng ký',
            url: 'https://joboapp.com/signup/2',
            webview_height_ratio: 'tall',
            messenger_extensions: true,
          },
          {
            type: 'postback',
            title: 'Tìm việc theo vị trí',
            payload: JSON.stringify({
              type: 'LOCATION',
            }),
          }
        ]
      }
    }
  }], message, 'template-bot');
}

const sendNotFoundEmail = (recipientId, message) => {
  sendMessage(recipientId, [{
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": textMessages.emailNotRegistered,
        "buttons": [{
            type: 'web_url',
            title: 'Đăng ký',
            url: 'https://joboapp.com/signup/2',
            webview_height_ratio: 'tall',
            messenger_extensions: true,
          },
          {
            type: 'postback',
            title: 'Tìm việc theo vị trí',
            payload: JSON.stringify({
              type: 'LOCATION',
            }),
          }
        ]
      }
    }
  }], message, 'template-bot');
}
// Send a different Welcome message based on if the user is logged in.
const sendReturnMessage = (recipientId, message, type = 'text-bot') => {
  UserStore.checkMessengerId(recipientId)
    .then(userProfile => {
      if (userProfile) {
        UserStore.getLastedConversation(recipientId)
          .then(conversation => {
            const key = Object.keys(conversation)[0];
            const lastedTime = Number(key);
            const timeDiff = Math.abs(Date.now() - lastedTime) / 60000; // Phút
            if (timeDiff >= 5 || (timeDiff < 5 && conversation[key].type.match(/.*-bot/g)[0])) sendMessage(
              recipientId, [{
                text: textMessages.adminContact
              }], message, type);
          });
      } else {
        sendLoggedOutWelcomeMessage(recipientId, message);
      }
    });
};

/**
 * Tìm việc xung quanh
 * @param  {[type]} recipientId [description]
 * @return {[type]}             [description]
 */
const sendQuickReplyAddress = (recipientId, message) => {
  UserStore.checkMessengerId(recipientId)
    .then(userProfile => {
      if (userProfile) {
        sendMessage(recipientId, [
          messages.locationMessage,
        ], message, 'location-bot');
      } else {
        sendLoggedOutWelcomeMessage(recipientId, message);
      }
    });
}

const sendWelcomeMessage = (recipientId) => {
  sendGetStartWelcomeMessage(recipientId);
};

// Send a successfully signed in message.
const sendSignOutSuccessMessage = (recipientId, message) =>
  sendMessage(recipientId, [
    messages.signOutSuccessMessage,
  ], message, 'template-bot');

// Send a successfully signed out message.
const sendSignInSuccessMessage = (recipientId, username, message) => {
  sendMessage(
    recipientId, [
      messages.signInGreetingMessage(username),
      messages.signInSuccessMessage,
    ], message, 'template-bot');
};
// Send a successfully signed up message.
const sendSignUpSuccessMessage = (recipientId, message) => {
  sendMessage(
    recipientId, [
      messages.signUpSuccessMessage,
    ], message, 'template-bot');
};
// Send a read receipt to indicate the message has been read
const sendReadReceipt = (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'mark_seen', // eslint-disable-line camelcase
  };

  api.callMessagesAPI(messageData);
};


const sendQuickReplyFindJobs = (recipientId, message) => {
  UserStore.checkMessengerId(recipientId)
    .then(userProfile => {
      if (userProfile) {
        sendMessage(
          recipientId, [
            messages.findJobs,
          ], message, 'quick-bot'
        );
      } else {
        sendLoggedOutWelcomeMessage(recipientId, message);
      }
    });
}


const sendGenericJobMessage = (recipientId, data, message) => {
  sendMessage(recipientId, [
    messages.genericMessage(data),
  ], message, 'generic-bot');
}

export default {
  vietnameseDecode: messages.vietnameseDecode,
  sendMessage,
  sendNotification,
  sendWelcomeMessage,
  sendReturnMessage,
  sendSignOutSuccessMessage,
  sendSignInSuccessMessage,
  sendReadReceipt,
  sendQuickReplyFindJobs,
  sendQuickReplyAddress,
  sendGenericJobMessage,
  sendAcceptPhone,
  sendComfirmPhone,
  sendComfirmEmail,
  sendWelcomeByPhone,
  sendNotFoundPhone,
  sendAcceptEmail,
  sendNotFoundEmail,
};
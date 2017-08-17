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
const sendMessage = (recipientId, messagePayloads) => {
  const messagePayloadArray = castArray(messagePayloads)
    .map((messagePayload) => messageToJSON(recipientId, messagePayload));

  api.callMessagesAPI(
    [
      typingOn(recipientId),
      ...messagePayloadArray,
      typingOff(recipientId),
    ]);
};



// Send a welcome message for a non signed-in user.
const sendLoggedOutWelcomeMessage = (recipientId) => {
  sendMessage(
    recipientId, [
      // messages.signOutSuccessMessage,
      {
        text: textMessages.askPhone
      }
    ]
  );
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
    ]
  );
  // UserStore.getByMessengerId(recipientId)
  //   .then(userProfile => {
  //     if (!isEmpty(userProfile)) {
  //       // sendLoggedInWelcomeMessage(recipientId, userProfile.name);
  //       sendQuickReplyAddress(recipientId);
  //     } else {
  //       sendMessage(recipientId, [
  //         messages.createAccountMessage
  //       ])
  //     }
  //   });
};
// Send a welcome message for a signed in user.
const sendLoggedInWelcomeMessage = (recipientId, username) => {
  sendMessage(
    recipientId, [
      messages.loggedInMessage(username),
    ]);
};

const sendAcceptPhone = (recipientId, phone) => {
  console.log('SENDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDd');
  sendMessage(recipientId, [{
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "Số điện thoại của bạn là " + phone,
        "buttons": [{
            type: 'postback',
            title: 'Đúng',
            payload: JSON.stringify({
              type: 'PHONE_FALSE',
              data: {
                phone: phone,
              },
            }),
          },
          {
            type: 'postback',
            title: 'Sai',
            payload: JSON.stringify({
              type: 'PHONE_TRUE',
              data: {
                phone: phone,
              },
            }),
          }
        ]
      }
    }
  }]);
};

const sendAcceptEmail = (recipientId, email) => {
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
              type: 'EMAIL_FALSE',
              data: {
                email: email,
              },
            }),
          },
          {
            type: 'postback',
            title: 'Sai',
            payload: JSON.stringify({
              type: 'EMAIL_TRUE',
              data: {
                email: email,
              },
            }),
          }
        ]
      }
    }
  }]);
};

const sendComfirmPhone = (recipientId) => {
  sendMessage(recipientId, [{
    text: 'Nhập lại số điện thoại'
  }]);
};

const sendComfirmEmail = (recipientId) => {
  sendMessage(recipientId, [{
    text: 'Nhập lại Email'
  }]);
};

const sendWelcomeByPhone = (recipientId, displayName) => {
  sendMessage(recipientId, [{
    text: `Xin chào ${displayName}\nTôi có thể giúp gì cho bạn?`
  }]);
};

const sendNotFoundPhone = (recipientId) => {
  sendMessage(recipientId, [{
    type: 'web_url',
    title: 'Bạn chưa đăng ký tài khoản với số điện thoại này, vui lòng đăng ký!',
    url: 'https://joboapp.com/signup/2',
    webview_height_ratio: 'tall',
    messenger_extensions: true,
  }]);
}

const sendNotFoundEmail = (recipientId) => {
  sendMessage(recipientId, [{
    type: 'web_url',
    title: 'Bạn chưa đăng ký tài khoản với email này, vui lòng đăng ký!',
    url: 'https://joboapp.com/signup/2',
    webview_height_ratio: 'tall',
    messenger_extensions: true,
  }]);
}
// Send a different Welcome message based on if the user is logged in.
const sendReturnMessage = (recipientId) => {

  // sendMessage(
  //   recipientId, [
  //     messages.napMessage
  //   ]);
  UserStore.getByMessengerId(recipientId)
    .then(userProfile => {
      if (!isEmpty(userProfile)) {
        // sendLoggedInWelcomeMessage(recipientId, userProfile.name);
        sendMessage(
          recipientId, [
            messages.napMessage
          ]);
        sendQuickReplyAddress(recipientId);
      } else {
        sendLoggedOutWelcomeMessage(recipientId);
      }
    });
};

/**
 * Tìm việc xung quanh
 * @param  {[type]} recipientId [description]
 * @return {[type]}             [description]
 */
const sendQuickReplyAddress = (recipientId) => {

  // sendMessage(recipientId, [
  //   messages.locationMessage,
  // ]);
  UserStore.getByMessengerId(recipientId)
    .then(userProfile => {
      if (!isEmpty(userProfile)) {
        sendMessage(recipientId, [
          messages.locationMessage,
        ]);
      } else {
        sendLoggedOutWelcomeMessage(recipientId);
      }
    });
}

const sendWelcomeMessage = (recipientId) => {
  sendGetStartWelcomeMessage(recipientId);
};

// Send a successfully signed in message.
const sendSignOutSuccessMessage = (recipientId) =>
  sendMessage(recipientId, [
    messages.signOutSuccessMessage,
  ]);

// Send a successfully signed out message.
const sendSignInSuccessMessage = (recipientId, username) => {
  sendMessage(
    recipientId, [
      messages.signInGreetingMessage(username),
      messages.signInSuccessMessage,
    ]);
};
// Send a successfully signed up message.
const sendSignUpSuccessMessage = (recipientId) => {
  sendMessage(
    recipientId, [
      messages.signUpSuccessMessage,
    ]);
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


const sendQuickReplyFindJobs = (recipientId) => {
  // sendMessage(
  //   recipientId, [
  //     messages.findJobs,
  //   ]
  // );
  UserStore.getByMessengerId(recipientId)
    .then(userProfile => {
      if (!isEmpty(userProfile)) {
        sendMessage(
          recipientId, [
            messages.findJobs,
          ]
        );
      } else {
        sendLoggedOutWelcomeMessage(recipientId);
      }
    });
}


const sendGenericJobMessage = (recipientId, data) => {
  sendMessage(recipientId, [
    messages.genericMessage(data),
  ]);
}

export default {
  vietnameseDecode: messages.vietnameseDecode,
  sendMessage,
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
  sendWelcomeByPhone,
  sendNotFoundPhone,
  sendAcceptEmail,
  sendNotFoundEmail,
};
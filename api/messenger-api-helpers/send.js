// ===== LODASH ================================================================
import castArray from 'lodash/castArray';
import isEmpty from 'lodash/isEmpty';
import textMessages from 'stores/text-messages';

// ===== MESSENGER =============================================================
import api from './api';
import messages from './messages';

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
      messages.signOutSuccessMessage,
    ]
  );
};

// Send a welcome message for a non signed-in user.
const sendGetStartWelcomeMessage = (recipientId) => {
  sendMessage(
    recipientId, [{
        text: textMessages.welcome,
      },
      messages.createAccountMessage,
    ]
  );
};
// Send a welcome message for a signed in user.
const sendLoggedInWelcomeMessage = (recipientId, username) => {
  sendMessage(
    recipientId, [
      messages.loggedInMessage(username),
    ]);
};

// Send a different Welcome message based on if the user is logged in.
const sendReturnMessage = (recipientId) => {
  sendMessage(
    recipientId, [
      messages.napMessage
    ]);
  UserStore.getByMessengerId(recipientId)
    .then(userProfile => {
      if (!isEmpty(userProfile)) {
        sendLoggedInWelcomeMessage(recipientId, userProfile.name);
      } else {
        sendLoggedOutWelcomeMessage(recipientId);
      }
    });
};

const sendWelcomeMessage = (recipientId) => {
  sendGetStartWelcomeMessage(recipientId);
};

// Send a successfully signed in message.
const sendSignOutSuccessMessage = (recipientId) =>
  sendMessage(recipientId, messages.signOutSuccessMessage);

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
  sendMessage(
    recipientId, [
      messages.findJobs,
    ]
  );
}


const sendGenericMessage_Job = (recipientId, data) => {
    // const messageData = {
    //     recipient: {
    //         id: recipientId
    //     },
    //     message: {
    //         attachment: {
    //             type: "template",
    //             payload: {
    //                 template_type: "generic",
    //                 elements: [{
    //                     title: CONFIG.data.job[data[0].job] + ' ' + CONFIG.data.working_type[data[0].working_type],
    //                     subtitle: data[0].storeName + " - " + data[0].distance + " km",
    //                     item_url: "https://www.joboapp.com/view/store/" + data[0].storeId,
    //                     image_url: data[0].avatar,
    //                     buttons: [{
    //                         type: "web_url",
    //                         url: "https://www.joboapp.com/view/store/" + data[0].storeId,
    //                         title: "Xem chi tiết để ứng tuyển"
    //                     }]
    //                 }, {
    //                     title: CONFIG.data.job[data[1].job] + ' ' + CONFIG.data.working_type[data[1].working_type],
    //                     subtitle: data[1].storeName + " - " + data[1].distance + " km",
    //                     item_url: "https://www.joboapp.com/view/store/" + data[1].storeId,
    //                     image_url: data[1].avatar,
    //                     buttons: [{
    //                         type: "web_url",
    //                         url: "https://www.joboapp.com/view/store/" + data[1].storeId,
    //                         title: "Chi tiết"
    //                     }]
    //                 }, {
    //                     title: CONFIG.data.job[data[2].job] + ' ' + CONFIG.data.working_type[data[2].working_type],
    //                     subtitle: data[2].storeName + " - " + data[2].distance + " km",
    //                     item_url: "https://www.joboapp.com/view/store/" + data[2].storeId,
    //                     image_url: data[2].avatar,
    //                     buttons: [{
    //                         type: "web_url",
    //                         url: "https://www.joboapp.com/view/store/" + data[2].storeId,
    //                         title: "Chi tiết"
    //                     }]
    //                 }, {
    //                     title: CONFIG.data.job[data[3].job] + ' ' + CONFIG.data.working_type[data[3].working_type],
    //                     subtitle: data[3].storeName + " - " + data[3].distance + " km",
    //                     item_url: "https://www.joboapp.com/view/store/" + data[3].storeId,
    //                     image_url: data[3].avatar,
    //                     buttons: [{
    //                         type: "web_url",
    //                         url: "https://www.joboapp.com/view/store/" + data[3].storeId,
    //                         title: "Chi tiết"
    //                     }]
    //                 }, {
    //                     title: CONFIG.data.job[data[4].job] + ' ' + CONFIG.data.working_type[data[4].working_type],
    //                     subtitle: data[4].storeName + " - " + data[4].distance + " km",
    //                     item_url: "https://www.joboapp.com/view/store/" + data[4].storeId,
    //                     image_url: data[4].avatar,
    //                     buttons: [{
    //                         type: "web_url",
    //                         url: "https://www.joboapp.com/view/store/" + data[4].storeId,
    //                         title: "Chi tiết"
    //                     }]
    //                 }, {
    //                     title: CONFIG.data.job[data[5].job] + ' ' + CONFIG.data.working_type[data[5].working_type],
    //                     subtitle: data[5].storeName + " - " + data[5].distance + " km",
    //                     item_url: "https://www.joboapp.com/view/store/" + data[5].storeId,
    //                     image_url: data[5].avatar,
    //                     buttons: [{
    //                         type: "web_url",
    //                         url: "https://www.joboapp.com/view/store/" + data[5].storeId,
    //                         title: "Chi tiết"
    //                     }]
    //                 }, {
    //                     title: "Xem thêm tại Joboapp.com",
    //                     item_url: "https://www.joboapp.com/",
    //                     image_url: SERVER_URL + '/public/assets/like.png',
    //                     buttons: [{
    //                         type: "web_url",
    //                         url: "https://www.joboapp.com",
    //                         title: "Xem chi tiết"
    //                     }]

    //                 }]

    //             }
    //         }
    //     }
    // };

    // callSendAPI(messageData);
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
};
import request from 'request';
import { PAGE_ACCESS_TOKEN, SERVER_URL } from 'app-config';

/**
 * [sendImageMessage description]
 * @param  {[int]} recipientId [recipient id]
 * @param  {[string]} image_path  [image path]
 * @return {[type]}             [description]
 */
export function sendImageMessage(recipientId, image_path) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + image_path
        }
      }
    }
  };

  callSendAPI(messageData);
}

/**
 * [sendGifMessage description]
 * @param  {[int]} recipientId [recipient id]
 * @param  {[string]} gif_path    [gif path]
 * @return {[type]}             [description]
 */
export function sendGifMessage(recipientId, gif_path) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: SERVER_URL + gif_path
        }
      }
    }
  };

  callSendAPI(messageData);
}

/**
 * [sendAudioMessage description]
 * @param  {[int]} recipientId [recipient id]
 * @param  {[string]} audio_path  [audio path]
 * @return {[type]}             [description]
 */
export function sendAudioMessage(recipientId, audio_path) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "audio",
        payload: {
          url: SERVER_URL + audio_path
        }
      }
    }
  };

  callSendAPI(messageData);
}

/**
 * [sendVideoMessage description]
 * @param  {[int]} recipientId recipient id
 * @param  {[string]} video_path  [video path]
 * @return {[type]}             [description]
 */
export function sendVideoMessage(recipientId, video_path) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "video",
        payload: {
          url: SERVER_URL + video_path
        }
      }
    }
  };

  callSendAPI(messageData);
}

/**
 * [sendFileMessage description]
 * @param  {[int]} recipientId [recipient id]
 * @param  {[string]} file_path   [file path]
 * @return {[type]}             [description]
 */
export function sendFileMessage(recipientId, file_path) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "file",
        payload: {
          url: SERVER_URL + file_path
        }
      }
    }
  };

  callSendAPI(messageData);
}

/**
 * [sendTextMessage description]
 * @param  {[int]} recipientId [recipient id]
 * @param  {[string]} messageText [message text]
 * @return {[type]}             [description]
 */
export function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  callSendAPI(messageData);
}

/**
 * send buttons message
 * @param  {int} recipientId [recipient id]
 * @param  {[Array]} buttons     [list object button: https://developers.facebook.com/docs/messenger-platform/send-api-reference/buttons]
 * {
 * type: 'btn_type' web_url, post_back, phone_number, element_share, payment, account_link, account_unlink
 * url || title || share_contents...: 'web_url'
 * }
 * @return {[type]}             [description]
 */
export function sendButtonMessage(recipientId, text, buttons) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text,
          buttons
        }
      }
    }
  };

  callSendAPI(messageData);
}

/**
 * [sendGenericMessage description]
 * @param  {[int]} recipientId [recipient id]
 * @param  {[Array]} elements    [generic elements: https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template]
 * @return {[type]}             [description]
 */
export function sendGenericMessage(recipientId, elements) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements
        }
      }
    }
  };

  callSendAPI(messageData);
}

/**
 * https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template
 * @param  {[int]} recipientId    [description]
 * @param  {[string]} recipient_name [description]
 * @param  {[string]} currency       [description]
 * @param  {[int]} order_number   [description]
 * @param  {[string]} payment_method [description]
 * @param  {[log]} timestamp      [description]
 * @param  {[Array]} elements       [description]
 * @param  {[object]} address        [description]
 * @param  {[object]} summary        [description]
 * @param  {[object]} adjustments    [description]
 * @return {[type]}                [description]
 */
export function sendReceiptMessage(recipientId, recipient_name, currency, order_number, payment_method, timestamp, elements, address, summary, adjustments) {
  // Generate a random receipt ID as the API requires a unique ID
  var receiptId = "order" + Math.floor(Math.random() * 1000);

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name,
          order_number,
          currency,
          payment_method,
          timestamp,
          elements,
          address,
          summary,
          adjustments
        }
      }
    }
  };

  callSendAPI(messageData);
}

/**
 * https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies
 * @param  {[int]} recipientId   [recipient id]
 * @param  {[string]} text          [message text]
 * @param  {[Array]} quick_replies [description]
 * @return {[type]}               [description]
 */
export function sendQuickReply(recipientId, text, quick_replies) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text,
      quick_replies
    }
  };

  callSendAPI(messageData);
}

/**
 * https://developers.facebook.com/docs/messenger-platform/account-linking/v2.10
 * @param  {[type]} recipientId [description]
 * @param  {[type]} text        [description]
 * @param  {[type]} type        [description]
 * @param  {[type]} path        [description]
 * @return {[type]}             [description]
 */
export function sendAccountLinking(recipientId, text, type, path) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text,
          buttons: [{
            type,
            url: SERVER_URL + path
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a read receipt to indicate the message has been read
 *
 */
export function sendReadReceipt(recipientId) {
  console.log("Sending a read receipt to mark message as seen");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "mark_seen"
  };

  callSendAPI(messageData);
}

/*
 * Turn typing indicator on
 *
 */
export function sendTypingOn(recipientId) {
  console.log("Turning typing indicator on");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };

  callSendAPI(messageData);
}

/*
 * Turn typing indicator off
 *
 */
export function sendTypingOff(recipientId) {
  console.log("Turning typing indicator off");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };

  callSendAPI(messageData);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
export function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s",
          messageId, recipientId);
      } else {
        console.log("Successfully called Send API for recipient %s",
          recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });
}
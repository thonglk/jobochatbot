/*
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* jshint node: true, devel: true */
'use strict';

const
    bodyParser = require('body-parser'),
    config = require('config'),
    crypto = require('crypto'),
    express = require('express'),
    https = require('https'),
    request = require('request');

var app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json({verify: verifyRequestSignature}));
app.use(express.static('public'));

/*
 * Be sure to setup your config values before running this code. You can 
 * set them using environment variables or modifying the config file in /config.
 *
 */

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
    process.env.MESSENGER_APP_SECRET :
    config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
    (process.env.MESSENGER_VALIDATION_TOKEN) :
    config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
    (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
    config.get('pageAccessToken');

// URL where the app is running (include protocol). Used to point to scripts and 
// assets located at this address. 
const SERVER_URL = (process.env.SERVER_URL) ?
    (process.env.SERVER_URL) :
    config.get('serverURL');


const CONFIG = {
    'UpdateAt': "2017-04-10T04:44:21.253Z",
    'Location': false,
    'WEBURL': 'https://joboapp.com',
    "APIURL": 'https://jobohihi.herokuapp.com',
    'FCM_KEY': "AAAArk3qIB4:APA91bEWFyuKiFqLt4UIrjUxLbduQCWJB4ACptTtgAovz4CKrMdonsS3jt06cfD9gGOQr3qtymBmKrsHSzGhqyJ_UWrrEbA4YheznlqYjsCBp_12bNPFSBepqg_qrxwdYxX_IcT9ne5z6s02I2mu2boy3VTN3lGPYg",
    "APIKey": 'AIzaSyATOX9rL_ULV-Q_e2kImu9wYgK2AToOteQ',
    "StatusChat": {
        0: "Đã gửi",
        1: "Đã xem"
    },
    "action": {
        "autoLogin": "tự động đăng nhập",
        "buy": "mua gói",
        "chat": "chat",
        "close": "đã offline",
        "confirmBuy": "xác nhận mua",
        "createAccount": "tạo tài khoản",
        "createNewStore": "tạo thêm cửa hàng",
        "createProfile": "tạo profile",
        "updateProfile": "cập nhật profile",
        "createStore": "tạo cửa hàng",
        "dislike": "ghét",
        "filter": "lọc",
        "filterMore": "lọc nâng cao",
        "like": "thích",
        "login": "đăng nhập",
        "match": "tương hợp",
        "open": "đã online",
        "register": "đăng ký",
        "updateStore": "cập nhật store",
        "viewChat": "vào page chat",
        "viewPricing": "vào bảng giá",
        "viewProfile": "xem hồ sơ",
        "viewSetting": "vào cài đặt",
        "viewStore": "xem cửa hàng",
        "getToken": "lấy token"
    },

    "data": {
        "industry": {
            "airlines": "Hàng không/ Sân bay",
            "beauty_salon": "Thẩm mỹ viện",
            "education_centre": "Trung tâm đào tạo",
            "golf_course": "Sân Golf",
            "gym": "Thể hình/ phòng tập",
            "karaoke": "Karaoke",
            "lodging": "Khách sạn/ Khu căn hộ",
            "real_estate": "Dự án BĐS/ Quản lý tòa nhà",
            "resort": "Resort/ Khu Du lịch",
            "restaurant_bar": "Nhà hàng/ Bar/ Pub",
            "supermarket_cinema": "Siêu thị/ Rạp phim",
            "travel_agency": "Công ty Du lịch/phòng vé",
            "store": "Cửa hàng/Bán lẻ",
            "other": "Khác",

        },
        "job": {
            "pg": "PG/Sự kiện",
            "actor": "Diễn viên/Casting",
            "administration": "Hành chính/ Nhân sự",
            "cabin_crew": "Tiếp viên hàng không",
            "cook": "Đầu bếp",
            "fashion": "Người mẫu/Thời trang",
            "financing_accounting": "Tài chính / Kế toán",
            "manager": "Quản lý điều hành",
            "marketing_pr": "Marketing/ PR",
            "mc_event": "MC/Sân khấu",
            "receptionist_cashier": "Lễ tân/ Thu ngân",
            "sale": "Bán hàng/sale",
            "secretary": "Trợ lý/Thư ký",
            "server": "Phục vụ",
            "designer": "Designer",
            "other": "Khác"
        },
        "languages": {
            "english": "Tiếng Anh",
            "chinese": "Tiếng Trung",
            "french": "Tiếng Pháp",
            "germain": "Đức ",
            "italian": "Ý",
            "japanese": "Tiếng Nhật",
            "korean": "Tiếng Hàn",
            "others ": "Khác",
            "portuguese ": "Bồ Đào Nha",
            "spanish": "Tây Ban Nha",
            "thai": "Thái Lan"
        },
        "time": {
            "morning": "Sáng",
            "noon": "Trưa",
            "afternoon": "Chiều",
            "evening": "Tối"
        },
        "working_type": {
            "fulltime": "Toàn thời gian",
            "parttime": "Bán thời gian",
            "seasonal": "Thời vụ"
        },

        "sex": {
            "male": "Nam",
            "female": "Nữ",
            "": "Không yêu cầu"
        },
        "sort": {
            "match": "Phù hợp nhất",
            "createdAt": "Thời gian",
            "distance": "Khoảng cách",
            "viewed": "Lượt xem",
            "rate": "Đánh giá",
            "feature": "Nổi bật"


        },
        "dataContentType": {
            "job": "Công việc",
            "store": "Thương hiệu"
        },
        "convertIns": {
            "store": {
                "bicycle_store": true,
                "book_store": true,
                "clothing_store": true,
                "convenience_store": true,
                "electronics_store": true,
                "florist": true,
                "furniture_store": true,
                "hardware_store": true,
                "home_goods_store": true,
                "jewelry_store": true,
                "laundry": true,
                "liquor_store": true,
                "meal_takeaway": true,
                "shoe_store": true,
                "pharmacy": true,
                "pet_store": true,
                "hair_care": true,
                "car_rental": true,
                "car_repair": true,
                "car_wash": true,
                "movie_rental": true,
                "store": true
            },
            "lodging": {
                "lodging": true
            },
            "restaurant_bar": {
                "bar": true,

                "cafe": true,
                "night_club": true,
                "restaurant": true
            },
            "resort": {
                "campground": true,
                "amusement_park": true,
                "aquarium": true,
                "park": true,
                "rv_park": true,
                "zoo": true
            },
            "beauty_salon": {
                "beauty_salon": true,
                "spa": true,
                "physiotherapist": true
            },
            "supermarket_cinema": {
                "movie_theater": true,
                "shopping_mall": true
            },
            "real_estate": {
                "art_gallery": true,
                "library": true,
                "museum": true,
                "real_estate_agency": true,
                "stadium": true
            },
            "education_centre": {
                "school": true,
                "university": true
            },
            "unique": {
                "gym": true,
                "travel_agency": true,
                "airport": true,
                "lodging": true
            }
        }
    },
    "chatlist": {
        0: "Tất cả ứng viên",
        1: "Đã gửi lời mời",
        2: "Đã ứng tuyển",
        3: "Đã tương hợp"
    },
    "chatlistUser": {
        0: "Tất cả công việc",
        1: "Đã ứng tuyển",
        2: "Đã tuyển bạn",
        3: "Đã tương hợp"
    },
    "review": {
        1: 'Rất tệ',
        2: 'Tệ',
        3: 'Ổn',
        4: 'Tốt',
        5: 'Xuất xắc'
    },
    "pack": {
        1: {
            "name": "Basic",
            "price": "100.000 đ/tháng"
        },
        2: {
            "name": "Premium",
            "price": "300.000 đ/tháng"
        },
        3: {
            "name": "Power",
            "price": "1.000.000 đ/tháng"
        }
    }
}
if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
    console.error("Missing config values");
    process.exit(1);
}

/*
 * Use your own validation token. Check that the token used in the Webhook 
 * setup is the same token used here.
 *
 */
app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.optin) {
                    receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    receivedMessage(messagingEvent);
                } else if (messagingEvent.delivery) {
                    receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedPostback(messagingEvent);
                } else if (messagingEvent.read) {
                    receivedMessageRead(messagingEvent);
                } else if (messagingEvent.account_linking) {
                    receivedAccountLink(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
});

/*
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL. 
 * 
 */
app.get('/authorize', function (req, res) {
    var { username, password } = req.query;
    var redirectURI = req.query.redirect_uri;

    // Authorization Code should be generated per user by the developer. This will
    // be passed to the Account Linking callback.
    var authCode = "1234567890";



    // Redirect users to this URI on successful login
    var redirectURISuccess = redirectURI + "&authorization_code=" + authCode +
    "&username=" + username +
    "&password=" + password;

    res.render('authorize', {
        username: username,
        redirectURI: redirectURI,
        redirectURISuccess: redirectURISuccess
    });
});

/*
 * Verify that the callback came from Facebook. Using the App Secret from 
 * the App Dashboard, we can verify the signature that is sent with each 
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
        // For testing, let's log an error. In production, you should throw an
        // error.
        console.error("Couldn't validate the signature.");
    } else {
        var elements = signature.split('=');
        var method = elements[0];
        var signatureHash = elements[1];

        var expectedHash = crypto.createHmac('sha1', APP_SECRET)
            .update(buf)
            .digest('hex');

        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}

/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to 
 * Messenger" plugin, it is the 'data-ref' field. Read more at 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
function receivedAuthentication(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfAuth = event.timestamp;

    // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
    // The developer can set this to an arbitrary value to associate the
    // authentication callback with the 'Send to Messenger' click event. This is
    // a way to do account linking when the user clicks the 'Send to Messenger'
    // plugin.
    var passThroughParam = event.optin.ref;

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
function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var isEcho = message.is_echo;
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var quickReply = message.quick_reply;

    if (isEcho) {
        // Just logging message echoes to console
        console.log("Received echo for message %s and app %d with metadata %s",
            messageId, appId, metadata);
        return;
    } else if (quickReply) {
        var quickReplyPayload = quickReply.payload;
        console.log("Quick reply for message %s with payload %s",
            messageId, quickReplyPayload);

        sendTextMessage(senderID, "Quick reply tapped");
        return;
    }

    if (messageText) {

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


            case 'image':
                sendImageMessage(senderID);
                break;

            case 'gif':
                sendGifMessage(senderID);
                break;

            case 'audio':
                sendAudioMessage(senderID);
                break;

            case 'video':
                sendVideoMessage(senderID);
                break;

            case 'file':
                sendFileMessage(senderID);
                break;

            case 'button':
                sendButtonMessage(senderID);
                break;

            case 'generic':
                sendGenericMessage(senderID);
                break;

            case 'receipt':
                sendReceiptMessage(senderID);
                break;

            case 'quick reply':
                sendQuickReply(senderID);
                break;

            case 'read receipt':
                sendReadReceipt(senderID);
                break;

            case 'typing on':
                sendTypingOn(senderID);
                break;

            case 'typing off':
                sendTypingOff(senderID);
                break;

            case 'account linking':
                sendAccountLinking(senderID);
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
            var location = messageAttachments[0].payload.coordinates
            var url = 'https://jobohihi.herokuapp.com/dash/job?lat=' + location.lat + '&lng=' + location.long;

            https.get(url, function (response) {
                var body = '';
                response.on('data', function (chunk) {
                    body += chunk;
                });

                response.on('end', function () {
                    var res = JSON.parse(body)
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
function receivedDeliveryConfirmation(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var delivery = event.delivery;
    var messageIDs = delivery.mids;
    var watermark = delivery.watermark;
    var sequenceNumber = delivery.seq;

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
function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful

    sendTextMessage(senderID, "Xin chào, cám ơn bạn đã sử dụng Jobo,")
    setTimeout(function () {
        sendQuickReply_Diachi(senderID);
    }, 1000)
}

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 * 
 */
function receivedMessageRead(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;

    // All messages before watermark (a timestamp) or sequence have been seen.
    var watermark = event.read.watermark;
    var sequenceNumber = event.read.seq;

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
function receivedAccountLink(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;

    var status = event.account_linking.status;
    var authCode = event.account_linking.authorization_code;

    console.log("Received account link event with for user %d with status %s " +
        "and auth code %s ", senderID, status, authCode);
}

/*
 * Send an image using the Send API.
 *
 */
function sendImageMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: SERVER_URL + "/assets/rift.png"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a Gif using the Send API.
 *
 */
function sendGifMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: SERVER_URL + "/assets/instagram_logo.gif"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send audio using the Send API.
 *
 */
function sendAudioMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "audio",
                payload: {
                    url: SERVER_URL + "/assets/sample.mp3"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a video using the Send API.
 *
 */
function sendVideoMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "video",
                payload: {
                    url: SERVER_URL + "/assets/allofus480.mov"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a file using the Send API.
 *
 */
function sendFileMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "file",
                payload: {
                    url: SERVER_URL + "/assets/test.txt"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
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

/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "This is test text",
                    buttons: [{
                        type: "web_url",
                        url: "https://www.oculus.com/en-us/rift/",
                        title: "Open Web URL"
                    }, {
                        type: "postback",
                        title: "Trigger Postback",
                        payload: "DEVELOPER_DEFINED_PAYLOAD"
                    }, {
                        type: "phone_number",
                        title: "Call Phone Number",
                        payload: "+16505551234"
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "rift",
                        subtitle: "Next-generation virtual reality",
                        item_url: "https://www.oculus.com/en-us/rift/",
                        image_url: SERVER_URL + "/assets/rift.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/rift/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for first bubble",
                        }],
                    }, {
                        title: "touch",
                        subtitle: "Your Hands, Now in VR",
                        item_url: "https://www.oculus.com/en-us/touch/",
                        image_url: SERVER_URL + "/assets/touch.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/touch/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for second bubble",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}
function sendGenericMessage_Job(recipientId, data) {
    var messageData = {
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

/*
 * Send a receipt message using the Send API.
 *
 */
function sendReceiptMessage(recipientId) {
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
                    recipient_name: "Peter Chang",
                    order_number: receiptId,
                    currency: "USD",
                    payment_method: "Visa 1234",
                    timestamp: "1428444852",
                    elements: [{
                        title: "Oculus Rift",
                        subtitle: "Includes: headset, sensor, remote",
                        quantity: 1,
                        price: 599.00,
                        currency: "USD",
                        image_url: SERVER_URL + "/assets/riftsq.png"
                    }, {
                        title: "Samsung Gear VR",
                        subtitle: "Frost White",
                        quantity: 1,
                        price: 99.99,
                        currency: "USD",
                        image_url: SERVER_URL + "/assets/gearvrsq.png"
                    }],
                    address: {
                        street_1: "1 Hacker Way",
                        street_2: "",
                        city: "Menlo Park",
                        postal_code: "94025",
                        state: "CA",
                        country: "US"
                    },
                    summary: {
                        subtotal: 698.99,
                        shipping_cost: 20.00,
                        total_tax: 57.67,
                        total_cost: 626.66
                    },
                    adjustments: [{
                        name: "New Customer Discount",
                        amount: -50
                    }, {
                        name: "$100 Off Coupon",
                        amount: -100
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
function sendQuickReply(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: "What's your favorite movie genre?",
            quick_replies: [
                {
                    "content_type": "text",
                    "title": "Action",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
                },
                {
                    "content_type": "text",
                    "title": "Comedy",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
                },
                {
                    "content_type": "text",
                    "title": "Drama",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
                }
            ]
        }
    };

    callSendAPI(messageData);
}
function sendQuickReply_Timviec(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: "Bạn muốn tìm việc gì?",
            quick_replies: [
                {
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
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: "Hãy gửi địa chỉ của bạn, mình sẽ tìm việc xung quanh đó cho bạn",
            quick_replies: [
                {
                    content_type: "location"
                }
            ]
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a read receipt to indicate the message has been read
 *
 */
function sendReadReceipt(recipientId) {
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
function sendTypingOn(recipientId) {
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
function sendTypingOff(recipientId) {
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
 * Send a message with the account linking call-to-action
 *
 */
function sendAccountLinking(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Welcome. Link your account.",
                    buttons: [{
                        type: "account_link",
                        url: SERVER_URL + "/authorize"
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: PAGE_ACCESS_TOKEN},
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

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid 
// certificate authority.
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;


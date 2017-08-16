// ===== APP CONFIG ============================================================
import { SERVER_URL } from 'app-config.js';
import textMessages from 'stores/text-messages';

/**
 * Loại bỏ dấu tiếng việt
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
const vietnameseDecode = (str) => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  //str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
  /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
  //str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
  str = str.replace(/^\-+|\-+$/g, "");
  //cắt bỏ ký tự - ở đầu và cuối chuỗi
  return str.toUpperCase();
}

/**
 * Account Link Button
 */
const signInButton = {
  type: 'account_link',
  url: `${SERVER_URL}/users/login`,
};

/**
 * Account Unlink Button
 */
const signOutButton = { type: 'account_unlink' };

/**
 * Message that informs the user the must sign in and prompts
 * them to set link their account.
 */
const createAccountMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: textMessages.createAccount,
      buttons: [signInButton],
    },
  },
};

/**
 * Fun message for saying hello to a signed in user.
 *
 * @param {String} username System username of the currently logged in user
 * @returns {Object} Message payload
 */
const signInGreetingMessage = (username) => {
  return {
    text: textMessages.hello(username),
  };
};

/**
 * Message that informs the user they've been succesfully logged in.
 *
 * @param {String} username System username of the currently logged in user
 * @returns {Object} Message payload
 */
const signInSuccessMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: textMessages.signInSuccess,
      buttons: [signOutButton],
    },
  },
};

const signUpSuccessMessage = {
  text: textMessages.signUpSuccess
}
/**
 * Message that informs the user they've been succesfully logged out.
 */
const signOutSuccessMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: textMessages.signOutSuccess,
      buttons: [signInButton],
    },
  },
};

/**
 * Message that informs the user they are currently logged in.
 *
 * @param {String} username System username of the currently logged in user
 * @returns {Object} Message payload
 */
const loggedInMessage = (username) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: textMessages.loggedIn(username),
        buttons: [signOutButton],
      },
    },
  };
};

/**
 * Fun message for saying hello to a signed in user.
 */
const napMessage = {
  text: textMessages.napMessage,
};

/**
 * The Get Started button.
 */
const getStarted = {
  setting_type: 'call_to_actions',
  thread_state: 'new_thread',
  call_to_actions: [{
    payload: JSON.stringify({
      type: 'GET_STARTED',
    }),
  }, ],
};

const findJobs = {
  text: textMessages.findJobs,
  quick_replies: textMessages.jobs.map(job => {
    return {
      "content_type": "text",
      "title": job,
      "payload": `DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_${vietnameseDecode(job).replace(' ', '')}`
    }
  }),
}

const locationMessage = {
  text: textMessages.location,
  quick_replies: [{
    content_type: "location"
  }]
}

const attachmentMessage = (type, url) => {
  return {
    attachment: {
      type,
      payload: {
        url
      }
    }
  }
}

/**
 * Button for displaying the job type menu inside a webview
 */
const setJobsButton = {
  type: 'web_url',
  title: textMessages.jobsMessage,
  url: `https://joboapp.com/`,
  webview_height_ratio: 'tall',
  messenger_extensions: true,
};

/**
 * The persistent menu for users to use.
 */
const persistentMenu = {
  setting_type: 'call_to_actions',
  thread_state: 'existing_thread',
  call_to_actions: [
    signInButton,
    setJobsButton,
  ],
};

export default {
  vietnameseDecode,
  persistentMenu,
  createAccountMessage,
  signInGreetingMessage,
  signInSuccessMessage,
  signOutSuccessMessage,
  loggedInMessage,
  napMessage,
  attachmentMessage,
  locationMessage,
  getStarted,
  findJobs,
};
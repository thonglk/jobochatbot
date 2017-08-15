// ===== APP CONFIG ============================================================
import { SERVER_URL } from 'app-config.js';
import textMessages from 'stores/text-messages';

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
const signOutButton = {type: 'account_unlink'};

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
  call_to_actions: [
    {
      payload: JSON.stringify({
        type: 'GET_STARTED',
      }),
    },
  ],
};

export default {
  createAccountMessage,
  signInGreetingMessage,
  signInSuccessMessage,
  signOutSuccessMessage,
  loggedInMessage,
  napMessage,
  getStarted,
};

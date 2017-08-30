import config from 'config';
import FIRE_BASE from './firebase-config';
import FIRE_BASE_ADMIN from './firebase-admin-config';
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
const PAGE_ACCESS_TOKENS = (process.env.MESSENGER_PAGE_ACCESS_TOKENS) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKENS) :
  config.get('pageAccessTokens');

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');

const WHITE_LIST_DOMAINS = (process.env.WHITE_LIST_DOMAINS) ?
  (process.env.WHITE_LIST_DOMAINS) :
  config.get('whiteListDomains');

const APIURL = (process.env.APIURL) ?
  (process.env.APIURL) :
  config.get('apiURL');

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKENS && SERVER_URL && WHITE_LIST_DOMAINS && APIURL)) {
  console.error("Missing config values");
  process.exit(1);
}

module.exports = { APP_SECRET, VALIDATION_TOKEN, PAGE_ACCESS_TOKENS, SERVER_URL, FIRE_BASE, FIRE_BASE_ADMIN, WHITE_LIST_DOMAINS, APIURL };
/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MESSENGER =============================================================
import messages from './messages';
import api from './api';
import { SERVER_URL, WHITE_LIST_DOMAINS } from 'config/app-config';

/**
 * Adds the server url to the Messenger App's whitelist.
 *
 * This is required to use Messenger Extensions which
 * this demo uses to get UserId's from a Messenger WebView.
 *
 * @returns {undefined}
 */
const setDomainWhitelisting = () => {
  api.callThreadAPI(
    {
      setting_type: 'domain_whitelisting',
      whitelisted_domains: WHITE_LIST_DOMAINS,
      domain_action_type: 'add',
    },
    {
      fields: 'whitelisted_domains',
    }
  );
};

/**
 * Sets the persistent menu for the application
 *
 * @returns {undefined}
 */
const setPersistentMenu = () => {
  api.callMenuAPI(messages.persistentMenu);
};

/**
 * setGetStarted - Sets the Get Started button for the application
 *
 * @returns {undefined}
 */
const setGetStarted = () => {
  api.callThreadAPI(messages.getStarted);
};

export default {
  setDomainWhitelisting,
  setPersistentMenu,
  setGetStarted,
};

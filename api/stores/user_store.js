// ===== LODASH ================================================================
import isEmpty from 'lodash/isEmpty';

// ===== STORES ================================================================
import Store from './store';

// ===== MODELS ================================================================
import User from 'models/user';

/**
 * Stores User data
 */
class UserStore extends Store {
  insert({ username, password, displayName, phone, birth, messengerId }) {
    const user = new User({
      username,
      password,
      displayName,
      phone,
      birth,
      messengerId,
    });
    return this.set(user);
  }

  getByMessengerId(messengerId) {
    return new Promise((resolve, reject) => {
      this.getByMessenger(messengerId)
        .then(userId => {
          console.log(userId);
          return this.get(userId);
        })
        .then(user => resolve(user));
    });
  }

  getMessengerIds() {
    return new Promise((resolve, reject) => {
      this.getConversations()
      .then(conversations => {
        resolve(Object.keys(conversations));
      })
      .catch(err => reject(err));
    });
  }

  linkMessengerAccount(id, messengerId) {
    return new Promise((resolve, reject) => {
      this.updateMessenger(id, messengerId)
        .then(status => {
          return this.get(id);
        })
        .then(user => resolve(user))
        .catch(err => reject(err));
    });
  }

  unlinkMessengerAccount(messengerId) {
    return this.updateMessenger(null, messengerId);
  }

  // replaceAuthToken(authToken, messengerId) {
  //   const currentUser = this.getByMessengerId(authToken);
  //   if (isEmpty(currentUser)) { return currentUser; }

  //   return this.linkMessengerAccount(currentUser.username, messengerId);
  // }
}

const USER_STORE = new UserStore();
// export an instantiated user store.
export default USER_STORE;
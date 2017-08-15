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
  insert({ username, password, displayName, phone, birth, jobs, avatar, messengerId }) {
    const user = new User({
      username,
      password,
      displayName,
      phone,
      birth,
      jobs,
      avatar,
      messengerId,
    });
    return this.set(user);
  }

  getByMessengerId(messengerId) {
    return this.getByMessenger(messengerId)
      .then(userId => {
        return this.get(userId);
      })
      .then(user => user);
  }

  linkMessengerAccount(id, messengerId) {
    return new Promise((resolve, reject) => {
      this.updateMessenger(id, messengerId)
        .then(status => {
          return this.get(id);
        })
        .then(user => resolve(user));
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
import firebase, { database, auth } from 'firebase';
/**
 * Base store class built around ES6 Weak Map
 * @export
 * @class Store
 */
export default class Store {
  constructor() {
    this.ref = database().ref('/users/');
    this.bot = database().ref('/facebook-bot/');
  }
  /**
   * Get user by id
   * @param  {firebase key} id user's firebase key
   * @return {promise}    firebase promise
   */
  get(id) {
    return new Promise((resolve, reject) => {
      this.ref.child(id).once('value')
        .then(user => resolve(user))
        .catch(err => {
          console.log(err);
          reject(null);
        });
    });
  }

  /**
   * Get all user
   * @return {promise} firebase promise
   */
  getAll() {
    return new Promise((resolve, reject) => {
      this.ref.once('value')
        .then(user => resolve(user))
        .catch(err => {
          console.log(err);
          reject(null);
        });
    });
  }

  getByMessenger(messengerId) {
    return new Promise((resolve, reject) => {
      this.bot.child(messengerId)
        .then(userId => resolve(userId))
        .catch(err => {
          console.log(err);
          reject(null);
        });
    });
  }
  /**
   * Set new user
   * @param {firebase key} options.id          firebase key
   * @param {string} options.username    user email
   * @param {string} options.password    user password
   * @param {string} options.displayName user display name
   * @param {string} options.phone       phone number
   * @param {date} options.birth       user birthday
   * @param {array} options.jobs        user jobs
   * @param {string} options.avatar      user photo url
   * @param {int} options.messengerId messenger id
   */
  set({ username, password, displayName, phone, birth, jobs, avatar, messengerId }) {
    return new Promise((resolve, reject) => {
      let id = '';
      auth().createUserWithEmailAndPassword(username, password)
        .then(createdUser => {
          id = createdUser.uid;
          return this.ref.child(id)
            .update({
              email: username,
              name: displayName,
              phone,
              type: 2,
              userId: id,
            });
        })
        .then(() => {
          if (!messengerId) Promise.resolve({ userId: id, username, password, displayName, phone, birth, jobs, avatar, messengerId });
          else return this.bot.child(messengerId).setValue(id);
        })
        .then(() => resolve({ userId: id, username, password, displayName, phone, birth, jobs, avatar, messengerId }))
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  /**
   * Update user
   * @param  {[type]} options.id          [description]
   * @param  {[type]} options.displayName [description]
   * @param  {[type]} options.phone       [description]
   * @param  {[type]} options.birth       [description]
   * @param  {[type]} options.jobs        [description]
   * @param  {[type]} options.avatar      [description]
   * @return {[type]}                     [description]
   */
  update({ id, displayName, phone, birth, jobs, avatar }) {
    return new Promise((resolve, reject) => {
      const user = this.ref.child(id);
      user.set({
          name: displayName || user.name,
          phone: phone || user.phone,
          birth: birth || user.birth
        })
        .then(() => resolve(true))
        .catch(err => {
          console.log(err);
          resolve(false);
        });
    });
  }

  updateMessenger(id, messengerId) {
    return new Promise((resolve, reject) => {
      const user = this.bot.child(messengerId);
      user.setValue(id)
        .then(() => resolve(true))
        .catch(err => {
          console.log(err);
          resolve(false);
        });
    });
  }

  /**
   * check existed user
   * @param  {string}  email email
   * @return {Boolean}       if existed return true
   */
  has(email) {
    this.getAll()
      .then(users => {
        if (!users.val()) return (false);
        else {
          users.val().forEach(user => {
            if (user.email === email) return (true);
            return (false);
          });
        }
      })
      .catch(err => {
        console.log(err);
        return (false);
      });
  }

  /**
   * Delete a user
   * @param  {firebase key} id user id
   * @return {Boolean}    if deleted return true
   */
  delete(id) {
    return new Promise((resolve, reject) => {
      this.ref.child(id).remove()
        .then(() => auth().currentUser)
        .then(() => resolve(true))
        .catch(err => {
          console.log(err);
          resolve(false);
        });
    });
  }
  //Storage firebase...
  ////.....
}
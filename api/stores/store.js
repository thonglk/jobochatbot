import firebase, { database, auth } from 'firebase-admin';
import axios from 'axios';
import { APIURL } from 'config/app-config';
/**
 * Base store class built around ES6 Weak Map
 * @export
 * @class Store
 */
export default class Store {
  constructor() {
    this.ref = database().ref('/users/');
    this.bot = database().ref('/facebook-bot/');
    this.conversations = database().ref('/conversations/');
  }
  /**
   * Get user by id
   * @param  {firebase key} id user's firebase key
   * @return {promise}    firebase promise
   */
  get(id) {
    return new Promise((resolve, reject) => {
      if (!id) resolve(null);
      this.ref.child(id).once('value')
        .then(user => {
          resolve(user.val());
        })
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
        .then(user => resolve(user.val()))
        .catch(err => {
          console.log(err);
          reject(null);
        });
    });
  }

  getByMessenger(messengerId) {
    return new Promise((resolve, reject) => {
      this.bot.child(messengerId).once('value')
        .then(userId => resolve(userId.val()))
        .catch(err => {
          console.log(err);
          resolve(null);
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
  set({ username, password, displayName, phone, birth, messengerId }) {
    return new Promise((resolve, reject) => {
      let id = '';
      // auth().createUserWithEmailAndPassword(username, password)
      console.log(phone);
      auth().createUser({
          email: username,
          emailVerified: false,
          password,
          displayName,
          disabled: false
        })
        .then(createdUser => {
          id = createdUser.uid;
          return this.ref.child(id)
            .update({
              createdAt: firebase.database.ServerValue.TIMESTAMP,
              email: username,
              mobileToken: id,
              name: displayName,
              phone,
              type: 2,
              userId: id,
              messengerId: 'null',
            });
        })
        // .then(() => {
        //   if (!messengerId) Promise.resolve({ userId: id, username, password, displayName, phone, birth, messengerId });
        //   else return this.bot.child(messengerId).set(id);
        // })
        .then(() => resolve({ userId: id, username, password, displayName, phone, birth, messengerId }))
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
  update({ id, displayName, phone, birth, messengerId }) {
    return new Promise((resolve, reject) => {
      this.ref.child(id)
        .update({
          name: displayName || user.name,
          phone: phone || user.phone,
          birth: birth || user.birth,
          messengerId: messengerId || user.messengerId
        })
        .then(() => resolve(true))
        .catch(err => {
          console.log(err);
          resolve(false);
        });
    });
  }

  checkMessengerId(messengerId) {
    return new Promise((resolve, reject) => {
      this.bot.once('value')
        .then(bots => {
          if (!bots.val()) resolve(false);
          // console.log('123123123asakkcjnjkansicnascnoi', bots.val());
          if (bots.val()[messengerId]) resolve(true);
          else resolve(false);
        })
        .catch(err => resolve(false));
    });
  }

  getConversations() {
    return new Promise((resolve, reject) => {
      this.conversations.once('value')
        .then(conversations => resolve(conversations.val()))
        .catch(err => reject(err));
    });
  }

  getConversation(messengerId) {
    return new Promise((resolve, reject) => {
      this.conversations.child(messengerId)
        .once('value')
        .then(conversation => resolve(conversation.val()))
        .catch(err => reject(err));
    });
  }
  updateMessengerByPhone(messengerId, phone, id) {
    return new Promise((resolve, reject) => {
      if (id) {
        const data = JSON.stringify({
          messengerId
        });
        // console.log('LSDJLSJDLKJSNSNCJSNCJNSJn1982y31n 189hasiudhasnd7yh 1', data);
        axios.get(`${APIURL}/update/user?userId=${id}&user=${data}`)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      this.bot.child(messengerId).set(phone)
        // .then(() => this.conversations.child(messengerId).set(phone))
        .then(() => resolve(true))
        .catch(err => resolve(false));
    });
  }

  updateMessenger(id, messengerId) {
    return new Promise((resolve, reject) => {
      if (id) {
        const data = JSON.stringify({
          messengerId
        });
        // console.log('LSDJLSJDLKJSNSNCJSNCJNSJn1982y31n 189hasiudhasnd7yh 1', data);
        axios.get(`${APIURL}/update/user?userId=${id}&user=${data}`)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      this.bot.child(messengerId).set(id)
        .then(() => {
          if (id) return this.ref.child(id).update({ messengerId });
          else return Promise.resolve(true);
        })
        .then(() => {
          if (id) return this.conversations.child(messengerId).set(id);
          else return Promise.resolve(true);
        })
        .then(() => resolve(true))
        .catch(err => resolve(false));
    });
  }

  updateConversations(messengerId, send, receive) {
    return new Promise((resolve, reject) => {
      this.conversations.child(messengerId)
        .child(`${firebase.database.ServerValue.TIMESTAMP}`)
        .update({
          send,
          receive
        })
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
        if (!users) return (false);
        else {
          users.forEach(user => {
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

  authenticate(email, password) {
    return new Promise((resolve, reject) => {
      auth().getUserByEmail(email)
        .then(_user => {
          const user = _user.toJSON();
          console.log(user);
          if (user.password === password) resolve(user);
          else {
            let error = new Error('Authentication failed');
            error.code = 403;
            reject(error);
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
  //Storage firebase...
  ////.....
}
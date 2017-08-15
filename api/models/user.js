import firebase, { database } from 'firebase';
/**
 * User Model
 * @class User
 */
export default class User {
  constructor({username, password, displayName, phone, birth, jobs, avatar, messengerId}) {
    this.id = database().ref().child('users').push().key;
    this.username = username;
    this.password = password;
    this.displayName = displayName;
    this.phone = phone;
    this.birth = birth;
    this.jobs = jobs;
    this.avatar = avatar;
    this.messengerId = messengerId;
  }
}

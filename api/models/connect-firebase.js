import * as firebase from 'firebase';
const firebaseConfig = require('../config');

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

module.exports = database;

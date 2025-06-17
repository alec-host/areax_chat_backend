const admin = require('firebase-admin');
const serviceAccount = require('../config/service.account.key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://plated-mantra-416619-default-rtdb.europe-west1.firebasedatabase.app'
});

const firebaseDb = admin.database();

module.exports = firebaseDb;

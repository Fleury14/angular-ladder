const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// player check firebase call?
exports.playerCheck = functions.https.onRequest((req, res) => {
    // const player2BeChecked = req.body.player;
    // const game = req.body.game;
    const playerList = functions.database.ref('/ladder/' + game + '/players/');
    console.log(playerList);
    res.send('testing', playerList)

    
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

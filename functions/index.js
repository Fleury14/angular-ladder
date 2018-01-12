const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// player check firebase call?
exports.getChallenges = functions.https.onRequest((req, res) => {
    
    const query = admin.database().ref('/x-challenges');
    const challenges = [];
    let test = '';
    query.once('value').then(snapshot => {
        snapshot.forEach(childSnap => {
            console.log('Child Snap:', childSnap.val());
            challenges.push({
                key: childSnap.key,
                challenger: childSnap.val().challengerName,
                defender: childSnap.val().defenderName,
                deadline: new Date(childSnap.val().deadline)
            });
        })
        res.send(challenges);
    });

    
    
    // const challengeRef = db.ref('/x-challenges');
    // challengeRef.once('value', function(snapshot) {
    //     res.send(snapshot.val().json());
    // })
    // // res.send('This is where i will have a list of challenges');

    
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

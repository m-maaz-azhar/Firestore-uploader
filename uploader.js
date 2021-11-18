var admin = require("firebase-admin");
var randomstring = require("randomstring");

var serviceAccount = require("./service-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "files");

firestore.collection('products').get().then(snap => {
  size = snap.size;
  console.log(size);
});

fs.readdir(directoryPath, function(err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function(file) {
    var lastDotIndex = file.lastIndexOf(".");

    var menu = require("./files/" + file);

    console.log(menu.length);
    menu.forEach(function(obj, i) {
      // const id = obj._id["$oid"];
      // delete obj._id;
      // delete obj.id;

      const id = randomstring.generate({
        length: 25,
        charset: 'alphanumeric'
      });

      firestore
        // .collection(file.substring(0, lastDotIndex))
        .collection('products')
        .doc(id)
        .set(obj)
        .then(function(docRef) {
          console.log("Document written", i);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    });
  });
});



//for DELETE
// const funct = async () => {
//   const snapshot = await firestore.collection('products').where('sku', '==', 'calendars').get();
//   snapshot.forEach(async (doc) => {
//     console.log(doc.id)
//     await doc.ref.delete();
//   });
// }
// funct();
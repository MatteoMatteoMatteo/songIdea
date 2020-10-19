const functions = require("firebase-functions");
const admin = require("firebase-admin");

export function searchArray(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].videoId === nameKey) {
      return myArray[i];
    }
  }
}

exports.deleteUserByEmail = functions.https.onReques(async (req, res) => {
  const userEmail = req.body.userEmail;

  await admin
    .auth()
    .getUserByEmail(userEmail)
    .then((userRecord) => {
      const uid = userRecord.uid;

      admin
        .auth()
        .deleteUser(uid)
        .then(() => {
          console.log("Success");
          res.status(200).send("Deleted User");
        })
        .catch((error) => {
          console.log("Error deleting user", error);
          res.status(500).send("Failed to delete User");
        });
    })
    .catch((error) => {
      console.log("Error fetchung user data", error);
      res.status(500).send("Failed");
    });
});

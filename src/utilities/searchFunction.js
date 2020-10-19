var firebase = require("firebase");

export function searchArray(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].videoId === nameKey) {
      return myArray[i];
    }
  }
}

export function deleteUser() {
  var user = firebase.auth().currentUser;
  user
    .delete()
    .then(function () {
      // User deleted.
    })
    .catch(function (error) {
      // An error happened.
    });
}

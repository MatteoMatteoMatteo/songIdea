export function searchArray(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].videoId === nameKey) {
      return myArray[i];
    }
  }
}

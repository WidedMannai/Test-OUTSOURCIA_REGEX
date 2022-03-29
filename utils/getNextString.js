function getNextString(string, word) {
  const regex1 = RegExp(`(${word}) ([0-9]{1,2}\.?[0-9]{1,2})`, 'gi');
  return regex1.exec(string)
}

exports.getNextString = getNextString;
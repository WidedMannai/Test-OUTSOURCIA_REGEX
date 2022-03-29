function getTime(time) {
  return time.length == 4 ? '0'.concat(time) : time;;
}

exports.getTime = getTime;
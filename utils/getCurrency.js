function getCurrency(currency) {
  switch (currency) {
      case "€":
          return "EUR";
      case "$":
          return "USD";
      default:
          return "CHF"
  }
}

exports.getCurrency = getCurrency;
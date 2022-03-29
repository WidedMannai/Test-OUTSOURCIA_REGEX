const {
  getTime
} = require("./utils/getTime");
const {
  getCurrency
} = require("./utils/getCurrency");
const {
  getNullValue
} = require("./utils/getNullValue");
const {
  getNextString
} = require("./utils/getNextString");

function parseSample(sample) {
  //departureTime
  const departureTime = sample.html.match(/[class="to time]*\d{1,}:\d{1,}/gm)[0].trim();
  const departureTimeF = getTime(departureTime)

  // arrivalTime
  const arrivalTime = sample.html.match(/[class="to time]*\d{1,}:\d{1,}/gm)[1].trim();
  const arrivalTimeF = getTime(arrivalTime)

  //currency
  const cur = sample.html.match(/[A-Z]{3}\$|\€/g)
  const currency = getCurrency(cur ? cur?.[0] : cur?.[0]);

  //duration: 
  const duration = sample.html.match(/\d{1,}:\d{1,}:\d{1,}/gm);
  const durationF = getNullValue(duration);

  //distance
  const html = sample.html.match(/<body.*?>(.*)<\/body>/g);
  const style = (html[0].replace(/src="(.*?)"|<style.*?>(.*)<\/style>/g, '')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const distance = getNextString(style, 'kilomètres') ? parseFloat(style.match(/\d{1,2}\.\d{1,2}/g)[1]) : 0;

  //distanceUnit
  const distanceUnit = distance ? "kilomètres" : "";

  //adresse
  const address = style.match(/\s[a-zA-Z0-9/-\s]+(\,)?[a-zA-Z0-9.'-\s]+(\,)? [0-9]{5,6} [a-zA-Z]+(\,)? [a-zA-Z]+(\.)?|[a-zA-Z\s]+(\.)?(\d{1,})+(\,)+ [0-9]{4,6} [a-zA-Zè]+(\,)+ [a-zA-Z]+/g);

  //arrivalAddress
  const arrivalAddress = address[1].trimStart();

  //departureAddress
  const departureAddress = address[0].trimStart();

  //distanceFee
  const distanceFee = getNextString(style, 'Distance') ? parseFloat(getNextString(style, 'Distance')[2].replace(",", ".")) : 0;

  //totalPricePaid   
  let totalPricePaid = ""
  if (sample.html.match(/\d{1,}\,\d{1,}[\sCHF]/g) == null) {
      const TPP = sample.html.match(/[€|\s CHF]\d{1,}\.\d{1,}[< \s| CHF]/g);
      totalPricePaid = parseFloat((TPP[TPP.length - 1]).replace(',', '.').replace('€', '').trimEnd());
  } else {
      const TPP = sample.html.match(/\d{1,}\,\d{1,}[\sCHF]/g);
      totalPricePaid = parseFloat(((TPP[TPP.length - 1]).replace(',', '.').trimEnd()));
  }

  //timeFee
  const timeFeeWithDot = getNextString(style, 'Temps') ? getNextString(style, 'Temps')[2].replace(",", ".") : null;
  const timeFee = timeFeeWithDot ? parseFloat(timeFeeWithDot) : 0;

  return {

      "arrivalAddress": arrivalAddress,
      "arrivalTime": arrivalTimeF,
      "currency": currency,
      "departureAddress": departureAddress,
      "departureTime": departureTimeF,
      "distance": distance,
      "distanceFee": distanceFee,
      "distanceUnit": distanceUnit,
      "duration": durationF,
      "timeFee": timeFee,
      "totalPricePaid": totalPricePaid,
  }



};
exports.parseSample = parseSample
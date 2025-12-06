function findGCD(number1, number2) {
  let max_number = Math.max(number1, number2);
  let min_number = Math.min(number1, number2);
  let remainder = max_number % min_number;

  while (remainder !== 0) {
    max_number = min_number;
    min_number = remainder;
    remainder = max_number % min_number;
  }

  return min_number;
}

const options = {
  // Use 'en-US' locale for comma (,) as the group separator
  // and period (.) as the decimal separator.
  locale: "en-US",
  // Set style to 'decimal' to get the standard number format
  // instead of 'currency'.
  style: "decimal",
  // The minimum number of fraction digits to use (0 for whole numbers)
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

function formatNumberToCurrency(number) {
  return new Intl.NumberFormat(options.locale, options).format(number);
}

function toAcceptablePrice(bidder_max_price, product_current_price) {
  return bidder_max_price - (bidder_max_price % product_current_price);
}

function parseIntFromCurrency(currency) {
  const splittedStr = currency.split(",");
  const result = splittedStr.reduce((numStr, element) => (numStr += element));

  return parseInt(result);
}

function convert(currency_str) {
  const regex = /[^0-9,]/g;
  const isNegative = currency_str.startsWith("-");
  const regex_matching_array = currency_str.match(regex);
  if (regex_matching_array) {
    regex_matching_array.forEach((item) => currency_str = currency_str.replaceAll(item, ""));    
  }

  if (currency_str.length > 0) {
    const currency_value = parseIntFromCurrency(currency_str);
    let formatted_currency = formatNumberToCurrency(currency_value);
    if (isNegative) {
      formatted_currency = "-" + formatted_currency.slice(0, formatted_currency.length);
    }

    return formatted_currency;
  }

  return "0";
}

console.log(convert(""));

// steps: 3
// bid: 19
// to: 18

// 7 % 2 = 1

//console.log(parseIntFromCurrency("-100,000"));

export {
  findGCD,
  formatNumberToCurrency,
  toAcceptablePrice,
  parseIntFromCurrency,
  convert
};

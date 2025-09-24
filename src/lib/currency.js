const supported = [
  { code: 'USD', label: 'US Dollar', symbol: '$', rateToUSD: 1 },
  { code: 'EUR', label: 'Euro', symbol: '€', rateToUSD: 1.08 },
  { code: 'GBP', label: 'British Pound', symbol: '£', rateToUSD: 1.27 },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹', rateToUSD: 0.012 },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥', rateToUSD: 0.0066 },
];

function getRate(code){
  const found = supported.find(c=>c.code===code) || supported[0];
  return found.rateToUSD;
}

export const currency = {
  getSupportedCurrencies(){ return supported; },
  format(amount, code){
    try{ return new Intl.NumberFormat(undefined, { style:'currency', currency: code }).format(amount); }
    catch{ return `${code} ${amount.toFixed(2)}`; }
  },
  convertAmount(amount, fromCode, toCode){
    if(fromCode===toCode) return amount;
    const usd = amount * getRate(fromCode);
    const to = 1 / getRate(toCode);
    return usd * to;
  }
};



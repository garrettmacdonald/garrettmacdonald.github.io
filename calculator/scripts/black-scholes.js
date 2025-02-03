// Black-Scholes Option Pricing Calculator
function normalCDF(x) {
    return (1 + math.erf(x / Math.sqrt(2))) / 2;
}

function blackScholes(S, K, T, r, sigma, type = 'call') {
    // S: Stock price
    // K: Strike price
    // T: Time to expiration (in years)
    // r: Risk-free interest rate (in decimal)
    // sigma: Volatility (in decimal)
    
    const d1 = (Math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    
    if (type === 'call') {
        return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    } else {
        return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
    }
}

function calculatePrices() {
    const S = parseFloat(document.getElementById('stockPrice').value);
    const K = parseFloat(document.getElementById('strikePrice').value);
    const T = parseFloat(document.getElementById('timeToExpiry').value);
    const r = parseFloat(document.getElementById('riskFreeRate').value) / 100;
    const sigma = parseFloat(document.getElementById('volatility').value) / 100;
    
    if (isNaN(S) || isNaN(K) || isNaN(T) || isNaN(r) || isNaN(sigma)) {
        return;
    }
    
    const callPrice = blackScholes(S, K, T, r, sigma, 'call');
    const putPrice = blackScholes(S, K, T, r, sigma, 'put');
    
    document.getElementById('callPrice').textContent = callPrice.toFixed(2);
    document.getElementById('putPrice').textContent = putPrice.toFixed(2);
}

// Add event listeners to all inputs
const inputs = ['stockPrice', 'strikePrice', 'timeToExpiry', 'riskFreeRate', 'volatility'];
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', calculatePrices);
});

// Calculate initial prices
document.addEventListener('DOMContentLoaded', calculatePrices);
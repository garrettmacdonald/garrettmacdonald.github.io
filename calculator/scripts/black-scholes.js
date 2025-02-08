// Black-Scholes Option Pricing Calculator
function normalCDF(x) {
    return (1 + math.erf(x / Math.sqrt(2))) / 2;
}

function blackScholes(S, K, DTE, r, sigma, type = 'call') {
    // S: Stock price
    // K: Strike price
    // DTE: Days to expiration
    // r: Risk-free interest rate (in decimal)
    // sigma: Volatility (in decimal)
    
    // Convert DTE to years
    const T = DTE / 365;
    
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
    const DTE = parseFloat(document.getElementById('daysToExpiry').value);
    const r = parseFloat(document.getElementById('riskFreeRate').value) / 100;
    const sigma = parseFloat(document.getElementById('volatility').value) / 100;
    
    // Input validation
    if (isNaN(S) || isNaN(K) || isNaN(DTE) || isNaN(r) || isNaN(sigma)) {
        return;
    }
    
    // Additional validation for DTE
    if (DTE < 0 || DTE > 3650) { // Max 10 years
        document.getElementById('callPrice').textContent = 'Invalid DTE';
        document.getElementById('putPrice').textContent = 'Invalid DTE';
        return;
    }
    
    const callPrice = blackScholes(S, K, DTE, r, sigma, 'call');
    const putPrice = blackScholes(S, K, DTE, r, sigma, 'put');
    
    document.getElementById('callPrice').textContent = callPrice.toFixed(2);
    document.getElementById('putPrice').textContent = putPrice.toFixed(2);
}

// Add event listeners to all inputs
const inputs = ['stockPrice', 'strikePrice', 'daysToExpiry', 'riskFreeRate', 'volatility'];
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', calculatePrices);
});

// Calculate initial prices
document.addEventListener('DOMContentLoaded', calculatePrices);
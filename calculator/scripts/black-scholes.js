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

function findImpliedVolatility(S, K, DTE, r, targetPrice, type) {
    let sigma = 0.5; // Initial guess of 50% volatility
    const tolerance = 0.0001;
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
        const price = blackScholes(S, K, DTE, r, sigma, type);
        if (Math.abs(price - targetPrice) < tolerance) {
            return sigma;
        }

        // Calculate derivative numerically
        const h = 0.0001;
        const derivative = (blackScholes(S, K, DTE, r, sigma + h, type) - 
                          blackScholes(S, K, DTE, r, sigma - h, type)) / (2 * h);
        
        if (Math.abs(derivative) < tolerance) break;
        
        sigma = sigma - (price - targetPrice) / derivative;
        
        // Check for invalid values
        if (sigma <= 0 || sigma > 5) return null;
    }
    return null; // Failed to converge
}

let lastUpdated = ''; // Tracks which input was last modified

function calculatePrices() {
    const S = parseFloat(document.getElementById('stockPrice').value);
    const K = parseFloat(document.getElementById('strikePrice').value);
    const DTE = parseFloat(document.getElementById('daysToExpiry').value);
    const r = parseFloat(document.getElementById('riskFreeRate').value) / 100;
    
    // Input validation
    if (isNaN(S) || isNaN(K) || isNaN(DTE) || isNaN(r)) {
        return;
    }
    
    // Additional validation for DTE
    if (DTE < 0 || DTE > 3650) {
        document.getElementById('callPrice').value = 'Invalid DTE';
        document.getElementById('putPrice').value = 'Invalid DTE';
        return;
    }

    if (lastUpdated === 'volatility') {
        const sigma = parseFloat(document.getElementById('volatility').value) / 100;
        if (!isNaN(sigma)) {
            const callPrice = blackScholes(S, K, DTE, r, sigma, 'call');
            const putPrice = blackScholes(S, K, DTE, r, sigma, 'put');
            document.getElementById('callPrice').value = callPrice.toFixed(2);
            document.getElementById('putPrice').value = putPrice.toFixed(2);
        }
    } else if (lastUpdated === 'callPrice') {
        const targetCall = parseFloat(document.getElementById('callPrice').value);
        if (!isNaN(targetCall)) {
            const impliedVol = findImpliedVolatility(S, K, DTE, r, targetCall, 'call');
            if (impliedVol !== null) {
                document.getElementById('volatility').value = (impliedVol * 100).toFixed(1);
                const putPrice = blackScholes(S, K, DTE, r, impliedVol, 'put');
                document.getElementById('putPrice').value = putPrice.toFixed(2);
            }
        }
    } else if (lastUpdated === 'putPrice') {
        const targetPut = parseFloat(document.getElementById('putPrice').value);
        if (!isNaN(targetPut)) {
            const impliedVol = findImpliedVolatility(S, K, DTE, r, targetPut, 'put');
            if (impliedVol !== null) {
                document.getElementById('volatility').value = (impliedVol * 100).toFixed(1);
                const callPrice = blackScholes(S, K, DTE, r, impliedVol, 'call');
                document.getElementById('callPrice').value = callPrice.toFixed(2);
            }
        }
    }
}

// Add event listeners to all inputs
const inputs = ['stockPrice', 'strikePrice', 'daysToExpiry', 'riskFreeRate', 'volatility', 'callPrice', 'putPrice'];
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
        lastUpdated = id;
        calculatePrices();
    });
});

// Calculate initial prices
document.addEventListener('DOMContentLoaded', () => {
    lastUpdated = 'volatility';
    calculatePrices();
});
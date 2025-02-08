// Black-Scholes Option Pricing Calculator
function normalCDF(x) {
    return (1 + math.erf(x / Math.sqrt(2))) / 2;
}

function blackScholes(S, K, DTE, r, sigma, type = 'call') {
    // Input validation
    if (!S || !K || !DTE || r === undefined || !sigma) return null;
    
    // Convert DTE to years
    const T = DTE / 365;
    
    try {
        const d1 = (Math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        
        if (type === 'call') {
            return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
        } else {
            return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
        }
    } catch (error) {
        console.error('Error in blackScholes calculation:', error);
        return null;
    }
}

function findImpliedVolatility(S, K, DTE, r, targetPrice, type) {
    // Input validation
    if (!S || !K || !DTE || r === undefined || !targetPrice) return null;
    
    try {
        let sigma = 0.5; // Initial guess of 50% volatility
        const tolerance = 0.0001;
        const maxIterations = 100;

        for (let i = 0; i < maxIterations; i++) {
            const price = blackScholes(S, K, DTE, r, sigma, type);
            if (!price) return null;
            
            if (Math.abs(price - targetPrice) < tolerance) {
                return sigma;
            }

            // Calculate derivative numerically
            const h = 0.0001;
            const priceUp = blackScholes(S, K, DTE, r, sigma + h, type);
            const priceDown = blackScholes(S, K, DTE, r, sigma - h, type);
            
            if (!priceUp || !priceDown) return null;
            
            const derivative = (priceUp - priceDown) / (2 * h);
            
            if (Math.abs(derivative) < tolerance) break;
            
            const newSigma = sigma - (price - targetPrice) / derivative;
            
            // Check for invalid values or lack of convergence
            if (newSigma <= 0 || newSigma > 5) return null;
            
            // Check if we're stuck oscillating
            if (Math.abs(newSigma - sigma) < tolerance / 100) break;
            
            sigma = newSigma;
        }
        return sigma;
    } catch (error) {
        console.error('Error in IV calculation:', error);
        return null;
    }
}

function calculateMoneyness(S, K) {
    if (!S || !K) return null;
    return ((K / S) - 1) * 100; // Convert to percentage
}

function calculateStrikeFromMoneyness(S, moneyness) {
    if (!S || moneyness === undefined) return null;
    return Math.round(S * (1 + moneyness / 100)); // Round to nearest whole number
}

let lastUpdated = '';
let isCalculating = false;

function updateCalculations() {
    if (isCalculating) return;
    isCalculating = true;

    try {
        const S = parseFloat(document.getElementById('stockPrice').value);
        const K = parseFloat(document.getElementById('strikePrice').value);
        const DTE = parseFloat(document.getElementById('daysToExpiry').value);
        const r = parseFloat(document.getElementById('riskFreeRate').value) / 100;

        // Handle moneyness calculations
        if (lastUpdated === 'strikePrice' || lastUpdated === 'stockPrice') {
            const moneyness = calculateMoneyness(S, K);
            if (moneyness !== null) {
                document.getElementById('moneyness').value = moneyness.toFixed(1);
            }
        } else if (lastUpdated === 'moneyness') {
            const moneyness = parseFloat(document.getElementById('moneyness').value);
            const newStrike = calculateStrikeFromMoneyness(S, moneyness);
            if (newStrike !== null) {
                document.getElementById('strikePrice').value = newStrike.toFixed(2);
            }
        }

        // Input validation
        if (isNaN(S) || isNaN(K) || isNaN(DTE) || isNaN(r) || DTE < 0 || DTE > 3650) {
            console.log('Invalid inputs detected');
            return;
        }

        console.log('Calculating with:', { lastUpdated, S, K, DTE, r });

        if (lastUpdated === 'volatility' || lastUpdated === '' || 
            lastUpdated === 'moneyness' || lastUpdated === 'stockPrice' || 
            lastUpdated === 'strikePrice') {
            const sigma = parseFloat(document.getElementById('volatility').value) / 100;
            if (!isNaN(sigma) && sigma > 0) {
                const callPrice = blackScholes(S, K, DTE, r, sigma, 'call');
                const putPrice = blackScholes(S, K, DTE, r, sigma, 'put');
                
                if (callPrice !== null && putPrice !== null) {
                    document.getElementById('callPrice').value = callPrice.toFixed(2);
                    document.getElementById('putPrice').value = putPrice.toFixed(2);
                    console.log('Updated prices from volatility:', { callPrice, putPrice });
                }
            }
        } else if (lastUpdated === 'callPrice') {
            const targetCall = parseFloat(document.getElementById('callPrice').value);
            if (!isNaN(targetCall)) {
                const impliedVol = findImpliedVolatility(S, K, DTE, r, targetCall, 'call');
                if (impliedVol !== null) {
                    document.getElementById('volatility').value = (impliedVol * 100).toFixed(1);
                    const putPrice = blackScholes(S, K, DTE, r, impliedVol, 'put');
                    if (putPrice !== null) {
                        document.getElementById('putPrice').value = putPrice.toFixed(2);
                        console.log('Updated from call price:', { impliedVol, putPrice });
                    }
                }
            }
        } else if (lastUpdated === 'putPrice') {
            const targetPut = parseFloat(document.getElementById('putPrice').value);
            if (!isNaN(targetPut)) {
                const impliedVol = findImpliedVolatility(S, K, DTE, r, targetPut, 'put');
                if (impliedVol !== null) {
                    document.getElementById('volatility').value = (impliedVol * 100).toFixed(1);
                    const callPrice = blackScholes(S, K, DTE, r, impliedVol, 'call');
                    if (callPrice !== null) {
                        document.getElementById('callPrice').value = callPrice.toFixed(2);
                        console.log('Updated from put price:', { impliedVol, callPrice });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in updateCalculations:', error);
    } finally {
        isCalculating = false;
    }
}

// Add event listeners to all inputs
const inputs = ['stockPrice', 'strikePrice', 'moneyness', 'daysToExpiry', 'riskFreeRate', 'volatility', 'callPrice', 'putPrice'];
inputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', function(e) {
            lastUpdated = id;
            console.log('Input changed:', id);
            updateCalculations();
        });
    }
});

// Initialize calculations
document.addEventListener('DOMContentLoaded', () => {
    lastUpdated = 'volatility';
    updateCalculations();
});
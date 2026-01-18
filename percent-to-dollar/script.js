/**
 * % → $ Allocation Converter
 * Handles percentage-to-dollar conversion with automatic redistribution
 */

// Configuration for each section
const config = {
    usd: {
        totalInputId: 'total-usd',
        assets: [
            { id: 'voo', amountId: 'voo-amount', percentId: 'voo-percent' },
            { id: 'qqqm', amountId: 'qqqm-amount', percentId: 'qqqm-percent' },
            { id: 'goog', amountId: 'goog-amount', percentId: 'goog-percent' }
        ],
        totalPercentId: 'total-percent-usd',
        currencySymbol: '$',
        locale: 'en-US'
    },
    cad: {
        totalInputId: 'total-cad',
        assets: [
            { id: 'btc', amountId: 'btc-amount', percentId: 'btc-percent' },
            { id: 'eth', amountId: 'eth-amount', percentId: 'eth-percent' }
        ],
        totalPercentId: 'total-percent-cad',
        currencySymbol: 'CA$',
        locale: 'en-CA'
    }
};

/**
 * Format number with comma separators for thousands
 * @param {string} value - The input value (may contain commas)
 * @returns {string} Formatted string with commas
 */
function formatNumberWithCommas(value) {
    // Remove all non-digit characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    // Split into integer and decimal parts
    const parts = numericValue.split('.');
    const integerPart = parts[0] || '';
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    
    // Add commas to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return formattedInteger + decimalPart;
}

/**
 * Parse comma-formatted number string to float
 * @param {string} value - The formatted string (may contain commas)
 * @returns {number} Parsed number
 */
function parseCommaFormattedNumber(value) {
    // Remove commas and parse
    const numericString = value.replace(/,/g, '');
    return parseFloat(numericString) || 0;
}

/**
 * Format currency amount based on locale and symbol
 * @param {number} amount - The amount to format
 * @param {string} symbol - Currency symbol (e.g., '$' or 'CA$')
 * @param {string} locale - Locale string (e.g., 'en-US' or 'en-CA')
 * @returns {string} Formatted currency string with custom symbol
 */
function formatCurrencyWithSymbol(amount, symbol, locale) {
    // Format number with thousands separators and 2 decimal places
    const formattedNumber = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    
    // Add custom currency symbol prefix
    return symbol + formattedNumber;
}

/**
 * Get current percentage values for all assets in a section
 * @param {Array} assets - Array of asset configuration objects
 * @returns {Array} Array of current percentage values
 */
function getPercentages(assets) {
    return assets.map(asset => {
        const select = document.getElementById(asset.percentId);
        return parseInt(select.value, 10);
    });
}

/**
 * Get total of all percentages
 * @param {Array} percentages - Array of percentage values
 * @returns {number} Sum of all percentages
 */
function getTotalPercent(percentages) {
    return percentages.reduce((sum, p) => sum + p, 0);
}

/**
 * Redistribute percentages when one changes to maintain 100% total
 * Uses proportional redistribution: remaining percentage is distributed
 * proportionally among other assets based on their current values
 * 
 * @param {Array} assets - Array of asset configuration objects
 * @param {number} changedIndex - Index of the asset that changed
 * @param {number} newValue - New percentage value for changed asset
 * @returns {Array} Array of redistributed percentages
 */
function redistributePercentages(assets, changedIndex, newValue) {
    const currentPercentages = getPercentages(assets);
    const currentTotal = getTotalPercent(currentPercentages);
    
    // Calculate the difference
    const oldValue = currentPercentages[changedIndex];
    const difference = newValue - oldValue;
    const remainingPercent = 100 - newValue;
    
    // Get percentages of other assets (excluding the changed one)
    const otherPercentages = currentPercentages.map((p, i) => 
        i === changedIndex ? 0 : p
    );
    const otherTotal = otherPercentages.reduce((sum, p) => sum + p, 0);
    
    // If no other assets have allocation, evenly distribute
    if (otherTotal === 0) {
        const equalShare = remainingPercent / (assets.length - 1);
        return currentPercentages.map((p, i) => 
            i === changedIndex ? newValue : Math.round(equalShare / 5) * 5
        );
    }
    
    // Proportional redistribution
    // Each other asset gets a share of remainingPercent proportional to its current share
    const redistributed = currentPercentages.map((p, i) => {
        if (i === changedIndex) {
            return newValue;
        }
        // Calculate proportional share
        const proportion = p / otherTotal;
        const share = remainingPercent * proportion;
        // Round to nearest 5% step
        return Math.round(share / 5) * 5;
    });
    
    // Adjust for rounding errors to ensure total is exactly 100%
    const redistributedTotal = redistributed.reduce((sum, p) => sum + p, 0);
    const adjustment = 100 - redistributedTotal;
    
    if (adjustment !== 0) {
        // Find the largest non-changed asset and adjust it
        let maxIndex = -1;
        let maxValue = -1;
        for (let i = 0; i < redistributed.length; i++) {
            if (i !== changedIndex && redistributed[i] > maxValue) {
                maxValue = redistributed[i];
                maxIndex = i;
            }
        }
        if (maxIndex >= 0) {
            redistributed[maxIndex] += adjustment;
        }
    }
    
    return redistributed;
}

/**
 * Update dollar amounts for all assets in a section
 * @param {Object} sectionConfig - Configuration object for the section
 */
function updateAmounts(sectionConfig) {
    const totalInput = document.getElementById(sectionConfig.totalInputId);
    const totalAmount = parseCommaFormattedNumber(totalInput.value);
    
    sectionConfig.assets.forEach(asset => {
        const percentSelect = document.getElementById(asset.percentId);
        const amountElement = document.getElementById(asset.amountId);
        const percent = parseInt(percentSelect.value, 10);
        const amount = (totalAmount * percent) / 100;
        
        let formattedAmount = formatCurrencyWithSymbol(
            amount,
            sectionConfig.currencySymbol,
            sectionConfig.locale
        );
        
        // Add USD prefix for USD section amounts
        if (sectionConfig.locale === 'en-US') {
            formattedAmount = 'USD ' + formattedAmount;
        }
        
        // Add space after CA for CAD amounts
        if (sectionConfig.locale === 'en-CA') {
            formattedAmount = formattedAmount.replace('CA$', 'CA $');
        }
        
        amountElement.textContent = formattedAmount;
    });
    
    // Update total percentage display
    const percentages = getPercentages(sectionConfig.assets);
    const totalPercent = getTotalPercent(percentages);
    const totalPercentElement = document.getElementById(sectionConfig.totalPercentId);
    totalPercentElement.textContent = `${totalPercent}%`;
}

/**
 * Handle percentage change for an asset
 * @param {Object} sectionConfig - Configuration object for the section
 * @param {number} changedIndex - Index of the asset that changed
 */
function handlePercentChange(sectionConfig, changedIndex) {
    const changedAsset = sectionConfig.assets[changedIndex];
    const percentSelect = document.getElementById(changedAsset.percentId);
    const newValue = parseInt(percentSelect.value, 10);
    
    // Redistribute percentages
    const redistributed = redistributePercentages(sectionConfig.assets, changedIndex, newValue);
    
    // Update all percentage selects
    redistributed.forEach((percent, index) => {
        const asset = sectionConfig.assets[index];
        const select = document.getElementById(asset.percentId);
        select.value = percent;
    });
    
    // Update amounts
    updateAmounts(sectionConfig);
}

/**
 * Initialize event listeners for a section
 * @param {string} sectionKey - Key for the section ('usd' or 'cad')
 */
function initializeSection(sectionKey) {
    const sectionConfig = config[sectionKey];
    
    // Listen to total amount input changes
    const totalInput = document.getElementById(sectionConfig.totalInputId);
    totalInput.addEventListener('input', () => {
        updateAmounts(sectionConfig);
    });
    
    // Listen to percentage select changes for each asset
    sectionConfig.assets.forEach((asset, index) => {
        const percentSelect = document.getElementById(asset.percentId);
        percentSelect.addEventListener('change', () => {
            handlePercentChange(sectionConfig, index);
        });
    });
    
    // Initial calculation
    updateAmounts(sectionConfig);
    
    // Set initial balanced distribution (equal shares, rounded to 5% steps)
    const equalShare = Math.floor(100 / sectionConfig.assets.length / 5) * 5;
    sectionConfig.assets.forEach((asset, index) => {
        const percentSelect = document.getElementById(asset.percentId);
        if (index === sectionConfig.assets.length - 1) {
            // Last asset gets remainder to ensure 100%
            const remaining = 100 - (equalShare * (sectionConfig.assets.length - 1));
            percentSelect.value = remaining;
        } else {
            percentSelect.value = equalShare;
        }
    });
    updateAmounts(sectionConfig);
}

// Initialize both sections when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSection('usd');
    initializeSection('cad');
    
    // Add comma formatting to total amount inputs
    const totalInputs = ['total-usd', 'total-cad'];
    totalInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            // Format on input
            input.addEventListener('input', (e) => {
                const cursorPosition = e.target.selectionStart;
                const oldValue = e.target.value;
                const newValue = formatNumberWithCommas(oldValue);
                
                // Only update if value changed (prevents cursor jumping)
                if (newValue !== oldValue) {
                    e.target.value = newValue;
                    
                    // Adjust cursor position after formatting
                    const commaDiff = (newValue.match(/,/g) || []).length - (oldValue.match(/,/g) || []).length;
                    const newCursorPosition = cursorPosition + commaDiff;
                    e.target.setSelectionRange(newCursorPosition, newCursorPosition);
                }
            });
            
            // Format initial value
            input.value = formatNumberWithCommas(input.value);
        }
    });
});
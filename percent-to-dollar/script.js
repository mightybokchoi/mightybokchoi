/**
 * % → $ Allocation Converter
 * Config-driven, handles percentage-to-dollar conversion with automatic redistribution
 */

const PERCENT_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

const letterBadge = (letter, hex) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='${hex.replace('#', '%23')}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-family='Arial,sans-serif' font-size='18' font-weight='bold' fill='white'%3E${letter}%3C/text%3E%3C/svg%3E`;

const GOOG_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23EA4335' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%234285F4' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E";

const CRYPTO_CDN = 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color';
const BTC_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23f7931a'/%3E%3Cpath fill='%23fff' d='M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12S4 22.6 4 16 9.4 4 16 4zm0 2C10.5 6 6 10.5 6 16s4.5 10 10 10 10-4.5 10-10S21.5 6 16 6zm.3 4.4c2.2 0 3.6.1 4.5.2.3.1.4.4.4.7 0 .3-.1.6-.3.7-.9.3-1.2.5-3.7.8-1.4.1-2.7.3-3.8.6-.8.2-1.4.6-1.8 1.2-.4.6-.6 1.3-.6 2.1 0 1.2.4 2.1 1.1 2.7.7.6 1.7 1 3 1.2.4.1.9.1 1.5.1v1.7h-2.4v1.7c-.6 0-1.2 0-1.8-.1-1.7-.2-3-.7-3.9-1.6-.9-.9-1.4-2.1-1.4-3.7 0-1.8.7-3.2 2.1-4.3 1.2-.9 2.8-1.4 4.8-1.5v1.7h1.5zm0 6.2v1.7h-1.5c-.7 0-1.2-.1-1.5-.4-.3-.3-.5-.7-.5-1.2 0-.7.3-1.2.9-1.5.4-.2 1-.3 1.6-.3v1.7h0z'/%3E%3C/svg%3E";
const ETH_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23627eea' d='M16 4L6 16l10 12 10-12z'/%3E%3Cpath fill='%23453a7b' d='M16 4v12L6 16z'/%3E%3Cpath fill='%238293f0' d='M16 28l10-12-10-8z'/%3E%3Cpath fill='%23453a7b' d='M6 16l10 12V20z'/%3E%3Cpath fill='%2314172a' d='M16 20l10-4-10 8z'/%3E%3C/svg%3E";

const sectionsConfig = {
  usd: {
    title: { strong: 'ETFs + Stocks', rest: ' Allocation' },
    inputLabel: '🇺🇸 Total Amount (USD)',
    totalInputId: 'total-usd',
    gridId: 'assets-usd',
    totalPercentId: 'total-percent-usd',
    currencySymbol: '$',
    locale: 'en-US',
    defaultPercentages: [50, 25, 15, 10],
    assets: [
      { id: 'voo', name: 'VOO', type: 'ETF', icon: () => letterBadge('V', '#800000'), search: 'VOO+stock+price' },
      { id: 'qqqm', name: 'QQQM', type: 'ETF', icon: () => letterBadge('Q', '#2563eb'), search: 'QQQM+stock+price' },
      { id: 'goog', name: 'GOOG', type: 'Stock', icon: () => GOOG_ICON, search: 'GOOG+stock+price' },
      { id: 'robo', name: 'ROBO', type: 'ETF', icon: () => letterBadge('R', '#222222'), search: 'ROBO+stock+price' }
    ]
  },
  cad: {
    title: { strong: 'Cryptocurrency', rest: ' Allocation' },
    inputLabel: '🇨🇦 Total Amount (CAD)',
    totalInputId: 'total-cad',
    gridId: 'assets-cad',
    totalPercentId: 'total-percent-cad',
    currencySymbol: 'CA$',
    locale: 'en-CA',
    defaultPercentages: [70, 30],
    assets: [
      { id: 'btc', name: 'BTC', type: null, icon: 'btc', search: 'BTC+bitcoin+price' },
      { id: 'eth', name: 'ETH', type: null, icon: 'eth', search: 'ETH+ethereum+price' }
    ]
  }
};

// Normalize config: derive amountId, percentId from id
Object.values(sectionsConfig).forEach(section => {
  section.assets = section.assets.map(a => ({
    ...a,
    amountId: `${a.id}-amount`,
    percentId: `${a.id}-percent`
  }));
});

function getAssetIconSrc(asset, sectionKey) {
  if (typeof asset.icon === 'function') return asset.icon();
  if (asset.icon === 'btc') return `${CRYPTO_CDN}/btc.svg`;
  if (asset.icon === 'eth') return `${CRYPTO_CDN}/eth.svg`;
  return '';
}

function getAssetIconFallback(asset) {
  if (asset.icon === 'btc') return BTC_FALLBACK;
  if (asset.icon === 'eth') return ETH_FALLBACK;
  return null;
}

function renderPercentOptions() {
  return PERCENT_OPTIONS.map(p => `<option value="${p}">${p}%</option>`).join('');
}

function renderAssetCard(asset, sectionKey) {
  const section = sectionsConfig[sectionKey];
  const iconSrc = getAssetIconSrc(asset, sectionKey);
  const fallback = getAssetIconFallback(asset);
  const imgAttrs = fallback
    ? `src="${iconSrc}" onerror="this.src='${fallback}'"`
    : `src="${iconSrc}"`;
  const typeLabel = asset.type ? ` <span class="asset-type">(${asset.type})</span>` : '';
  const searchUrl = `https://www.google.com/search?q=${asset.search}`;

  return `
    <div class="asset-card">
      <div class="asset-header">
        <img ${imgAttrs} alt="${asset.name}" class="asset-icon">
        <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" class="asset-name">${asset.name}</a>${typeLabel}
      </div>
      <div class="asset-controls">
        <label for="${asset.percentId}" class="percent-label">Percentage</label>
        <select id="${asset.percentId}" class="percent-select" data-asset="${asset.id}">${renderPercentOptions()}</select>
      </div>
      <div class="asset-amount">
        <span class="amount-label">Amount</span>
        <span id="${asset.amountId}" class="amount-value">${section.currencySymbol}0.00</span>
      </div>
    </div>`;
}

function renderSection(sectionKey) {
  const s = sectionsConfig[sectionKey];
  const assetCards = s.assets.map(a => renderAssetCard(a, sectionKey)).join('');
  return `
    <section class="allocation-section">
      <h1 class="section-title"><strong>${s.title.strong}</strong>${s.title.rest}</h1>
      <div class="input-group">
        <label for="${s.totalInputId}" class="input-label">${s.inputLabel}</label>
        <div class="input-with-prefix">
          <span class="input-prefix">$</span>
          <input type="text" id="${s.totalInputId}" class="total-input" inputmode="decimal" value="10,000">
        </div>
      </div>
      <div class="assets-grid" id="${s.gridId}">${assetCards}</div>
      <div class="total-display">
        <span class="total-label">Total Allocation:</span>
        <span id="${s.totalPercentId}" class="total-percent">0%</span>
      </div>
    </section>`;
}

function formatNumberWithCommas(value) {
  const numericValue = value.replace(/[^\d.]/g, '');
  const parts = numericValue.split('.');
  const integerPart = parts[0] || '';
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
  return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + decimalPart;
}

function parseCommaFormattedNumber(value) {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

function formatCurrencyWithSymbol(amount, symbol, locale) {
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  return symbol + formattedNumber;
}

function getPercentages(assets) {
  return assets.map(a => parseInt(document.getElementById(a.percentId).value, 10));
}

function getTotalPercent(percentages) {
  return percentages.reduce((sum, p) => sum + p, 0);
}

function redistributePercentages(assets, changedIndex, newValue) {
  const currentPercentages = getPercentages(assets);
  const remainingPercent = 100 - newValue;
  const otherPercentages = currentPercentages.map((p, i) => (i === changedIndex ? 0 : p));
  const otherTotal = otherPercentages.reduce((sum, p) => sum + p, 0);

  if (otherTotal === 0) {
    const equalShare = remainingPercent / (assets.length - 1);
    return currentPercentages.map((p, i) =>
      i === changedIndex ? newValue : Math.round(equalShare / 5) * 5
    );
  }

  const redistributed = currentPercentages.map((p, i) => {
    if (i === changedIndex) return newValue;
    const proportion = p / otherTotal;
    return Math.round((remainingPercent * proportion) / 5) * 5;
  });

  const adjustment = 100 - redistributed.reduce((sum, p) => sum + p, 0);
  if (adjustment !== 0) {
    let maxIndex = -1;
    let maxValue = -1;
    for (let i = 0; i < redistributed.length; i++) {
      if (i !== changedIndex && redistributed[i] > maxValue) {
        maxValue = redistributed[i];
        maxIndex = i;
      }
    }
    if (maxIndex >= 0) redistributed[maxIndex] += adjustment;
  }
  return redistributed;
}

function updateAmounts(sectionConfig) {
  const totalAmount = parseCommaFormattedNumber(
    document.getElementById(sectionConfig.totalInputId).value
  );
  const s = sectionConfig;

  s.assets.forEach(asset => {
    const percent = parseInt(document.getElementById(asset.percentId).value, 10);
    const amount = (totalAmount * percent) / 100;
    let formatted = formatCurrencyWithSymbol(amount, s.currencySymbol, s.locale);
    if (s.locale === 'en-US') formatted = 'USD ' + formatted;
    if (s.locale === 'en-CA') formatted = formatted.replace('CA$', 'CA $');
    document.getElementById(asset.amountId).textContent = formatted;
  });

  const totalPercent = getTotalPercent(getPercentages(s.assets));
  document.getElementById(s.totalPercentId).textContent = `${totalPercent}%`;
}

function handlePercentChange(sectionConfig, changedIndex) {
  const newValue = parseInt(
    document.getElementById(sectionConfig.assets[changedIndex].percentId).value,
    10
  );
  const redistributed = redistributePercentages(sectionConfig.assets, changedIndex, newValue);
  redistributed.forEach((percent, i) => {
    document.getElementById(sectionConfig.assets[i].percentId).value = percent;
  });
  updateAmounts(sectionConfig);
}

function initializeSection(sectionKey) {
  const s = sectionsConfig[sectionKey];

  document.getElementById(s.totalInputId).addEventListener('input', () => updateAmounts(s));

  s.assets.forEach((asset, index) => {
    document.getElementById(asset.percentId).addEventListener('change', () => {
      handlePercentChange(s, index);
    });
  });

  if (s.defaultPercentages) {
    s.assets.forEach((a, i) => {
      document.getElementById(a.percentId).value = s.defaultPercentages[i];
    });
  } else {
    const equalShare = Math.floor(100 / s.assets.length / 5) * 5;
    s.assets.forEach((a, i) => {
      document.getElementById(a.percentId).value =
        i === s.assets.length - 1
          ? 100 - equalShare * (s.assets.length - 1)
          : equalShare;
    });
  }
  updateAmounts(s);
}

function setupCommaFormatting(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', e => {
    const cursorPos = e.target.selectionStart;
    const oldVal = e.target.value;
    const newVal = formatNumberWithCommas(oldVal);
    if (newVal !== oldVal) {
      e.target.value = newVal;
      const commaDiff = (newVal.match(/,/g) || []).length - (oldVal.match(/,/g) || []).length;
      e.target.setSelectionRange(cursorPos + commaDiff, cursorPos + commaDiff);
    }
  });
  input.value = formatNumberWithCommas(input.value);
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('sections-container');
  container.innerHTML = Object.keys(sectionsConfig).map(renderSection).join('');

  Object.keys(sectionsConfig).forEach(initializeSection);
  Object.values(sectionsConfig).forEach(s => setupCommaFormatting(s.totalInputId));
});

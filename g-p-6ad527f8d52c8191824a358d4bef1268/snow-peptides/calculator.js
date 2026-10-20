(() => {
  const form = document.querySelector('#concentration-form');
  if (!form) return;

  const amountInput = document.querySelector('#material-amount');
  const amountUnit = document.querySelector('#amount-unit');
  const volumeInput = document.querySelector('#liquid-volume');
  const volumeUnit = document.querySelector('#volume-unit');
  const sampleProduct = document.querySelector('#sample-product');
  const sampleLabel = document.querySelector('#sample-label');
  const error = document.querySelector('#calculator-error');
  const empty = document.querySelector('#calculator-empty');
  const output = document.querySelector('#calculator-output');
  const meta = document.querySelector('#calculator-meta');
  const shareButton = document.querySelector('#share-calculation');
  const amountLabel = document.querySelector('#result-label-wrap');
  const resultValue = document.querySelector('#result-mgml');
  const resultMainUnit = document.querySelector('#result-main-unit');
  const resultSecondary = document.querySelector('#result-ugml');
  const mobileResultUnit = document.querySelector('#mobile-result-unit');
  const format = new Intl.NumberFormat('de-DE', { maximumSignificantDigits: 6 });
  const amountToMg = { mg: 1, ug: 0.001, g: 1000 };
  const volumeToMl = { ML: 1, UI: 0.001 };

  const syncUnitChoices = () => {
    document.querySelectorAll('[data-unit-for]').forEach((button) => {
      const select = document.querySelector(`#${button.dataset.unitFor}`);
      button.classList.toggle('is-active', select?.value === button.dataset.unit);
    });
  };

  const syncStepState = () => {
    const states = [
      ['amount', amountInput.value.trim() !== '' && Number(amountInput.value) > 0],
      ['volume', volumeInput.value.trim() !== '' && Number(volumeInput.value) > 0]
    ];
    states.forEach(([name, complete]) => {
      const step = document.querySelector(`[data-calculator-step="${name}"]`);
      if (!step) return;
      step.classList.toggle('is-complete', complete);
      const state = step.querySelector('.calculator-step-state');
      if (state) state.textContent = complete ? '✓' : '○';
    });
  };

  const clearResult = () => {
    empty.hidden = false;
    output.hidden = true;
    meta.hidden = true;
    amountLabel.hidden = true;
    shareButton.disabled = true;
    document.querySelector('#mobile-result-value').textContent = '—';
    mobileResultUnit.textContent = 'mg/mL';
    syncStepState();
  };

  const calculate = (showError = false) => {
    const amount = Number(amountInput.value);
    const volume = Number(volumeInput.value);
    const valid = amountInput.value.trim() !== '' && volumeInput.value.trim() !== '' &&
      Number.isFinite(amount) && Number.isFinite(volume) && amount > 0 && volume > 0;

    if (!valid) {
      clearResult();
      error.hidden = !showError;
      return;
    }

    error.hidden = true;
    const volumeMl = volume * volumeToMl[volumeUnit.value];
    const isInternationalUnits = amountUnit.value === 'iu';
    const concentration = isInternationalUnits
      ? amount / volumeMl
      : (amount * amountToMg[amountUnit.value]) / volumeMl;
    if (!Number.isFinite(concentration) || concentration <= 0) {
      clearResult();
      error.hidden = !showError;
      return;
    }
    const concentrationUnit = isInternationalUnits ? 'IU/mL' : 'mg/mL';
    resultValue.textContent = format.format(concentration);
    resultMainUnit.textContent = concentrationUnit;
    resultSecondary.hidden = isInternationalUnits;
    if (!isInternationalUnits) resultSecondary.textContent = `${format.format(concentration * 1000)} µg/mL`;
    document.querySelector('#mobile-result-value').textContent = format.format(concentration);
    mobileResultUnit.textContent = concentrationUnit;
    document.querySelector('#result-amount').textContent = `${format.format(amount)} ${amountUnit.options[amountUnit.selectedIndex].text}`;
    document.querySelector('#result-volume').textContent = `${format.format(volume)} ${volumeUnit.options[volumeUnit.selectedIndex].text}`;
    const label = sampleProduct.value === 'custom' ? sampleLabel.value.trim() : sampleProduct.value;
    document.querySelector('#result-label').textContent = label;
    amountLabel.hidden = !label;
    empty.hidden = true;
    output.hidden = false;
    meta.hidden = false;
    shareButton.disabled = false;
    syncStepState();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculate(true);
  });
  form.addEventListener('input', () => calculate(false));
  form.addEventListener('change', () => { syncUnitChoices(); calculate(false); });
  sampleProduct.addEventListener('change', () => {
    const custom = sampleProduct.value === 'custom';
    sampleLabel.hidden = !custom;
    if (!custom) sampleLabel.value = '';
    calculate(false);
  });
  form.addEventListener('click', (event) => {
    const unitButton = event.target.closest('[data-unit-for]');
    if (unitButton) {
      const select = document.querySelector(`#${unitButton.dataset.unitFor}`);
      if (select) {
        select.value = unitButton.dataset.unit;
        syncUnitChoices();
        calculate(false);
      }
      return;
    }
    const quickButton = event.target.closest('[data-quick-for]');
    if (!quickButton) return;
    const target = document.getElementById(quickButton.dataset.quickFor);
    if (!target) return;
    if (quickButton.dataset.value === 'other') {
      target.focus();
      return;
    }
    target.value = quickButton.dataset.value;
    if (target === amountInput) amountUnit.value = 'mg';
    if (target === volumeInput) volumeUnit.value = 'ml';
    syncUnitChoices();
    calculate(false);
  });
  form.addEventListener('reset', () => requestAnimationFrame(() => {
    error.hidden = true;
    clearResult();
    syncUnitChoices();
  }));

  shareButton.addEventListener('click', async () => {
    if (shareButton.disabled) return;
    const url = new URL(window.location.href);
    url.searchParams.set('amount', amountInput.value);
    url.searchParams.set('amountUnit', amountUnit.value);
    url.searchParams.set('volume', volumeInput.value);
    url.searchParams.set('volumeUnit', volumeUnit.value);
    if (sampleProduct.value && sampleProduct.value !== 'custom') url.searchParams.set('product', sampleProduct.value);
    else url.searchParams.delete('product');
    if (sampleProduct.value === 'custom' && sampleLabel.value.trim()) url.searchParams.set('label', sampleLabel.value.trim());
    else url.searchParams.delete('label');
    const toast = document.querySelector('.toast');
    try {
      if (navigator.share) await navigator.share({ title: 'Konzentrationsberechnung', url: url.href });
      else {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url.href);
        else {
          const temporary = document.createElement('textarea');
          temporary.value = url.href;
          temporary.setAttribute('readonly', '');
          temporary.style.position = 'fixed';
          temporary.style.opacity = '0';
          document.body.append(temporary);
          temporary.select();
          const copied = document.execCommand('copy');
          temporary.remove();
          if (!copied) throw new Error('Kopieren nicht unterstützt');
        }
        if (toast) { toast.textContent = 'Link zur Berechnung kopiert.'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
      }
    } catch {
      if (toast) { toast.textContent = 'Teilen ist in diesem Browser nicht verfügbar.'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
    }
  });

  const sharedUrl = new URL(window.location.href);
  const sharedAmount = Number(sharedUrl.searchParams.get('amount'));
  const sharedVolume = Number(sharedUrl.searchParams.get('volume'));
  const sharedProduct = sharedUrl.searchParams.get('product');
  const sharedLabel = sharedUrl.searchParams.get('label');
  if (sharedProduct && [...sampleProduct.options].some((option) => option.value === sharedProduct)) sampleProduct.value = sharedProduct;
  if (sharedLabel) { sampleProduct.value = 'custom'; sampleLabel.hidden = false; sampleLabel.value = sharedLabel.slice(0, 60); }
  if (sharedUrl.searchParams.has('amount') && sharedUrl.searchParams.has('volume') && sharedAmount > 0 && sharedVolume > 0) {
    amountInput.value = String(sharedAmount);
    volumeInput.value = String(sharedVolume);
    if (['mg', 'ug', 'g', 'iu'].includes(sharedUrl.searchParams.get('amountUnit'))) amountUnit.value = sharedUrl.searchParams.get('amountUnit');
    if (['ml', 'ul', 'l'].includes(sharedUrl.searchParams.get('volumeUnit'))) volumeUnit.value = sharedUrl.searchParams.get('volumeUnit');
    calculate(false);
  }
  syncUnitChoices();
  syncStepState();
})();

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 3;
  const formData = { service: '', firstName: '', phone: '', email: '', address: '', city: '', zip: '', propertyType: 'Residential', date: '', time: '', notes: '' };

  const steps = document.querySelectorAll('.form-step');
  const progressDots = document.querySelectorAll('.progress-step');
  const confirmation = document.querySelector('.confirmation');
  const upsellBanner = document.querySelector('.upsell-banner');
  const upsellText = document.querySelector('.upsell-service-name');

  // Service selection
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.svc-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      formData.service = card.dataset.service;

      // Upsell banner
      if (formData.service === 'paver') {
        if (upsellText) upsellText.textContent = 'Epoxy Coatings';
        upsellBanner?.classList.add('visible');
      } else if (formData.service === 'epoxy') {
        if (upsellText) upsellText.textContent = 'Paver Sealing';
        upsellBanner?.classList.add('visible');
      } else {
        upsellBanner?.classList.remove('visible');
      }

      updateNextBtn();
    });
  });

  // Upsell → select bundle
  document.querySelector('.upsell-link')?.addEventListener('click', () => {
    document.querySelectorAll('.svc-card').forEach(c => c.classList.remove('selected'));
    const bundle = document.querySelector('.svc-card[data-service="both"]');
    bundle?.classList.add('selected');
    formData.service = 'both';
    upsellBanner?.classList.remove('visible');
    updateNextBtn();
  });

  // Time option selection
  document.querySelectorAll('.time-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.time-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      formData.time = opt.dataset.time;
    });
  });

  // Property type
  document.querySelectorAll('.property-toggle input').forEach(radio => {
    radio.addEventListener('change', () => { formData.propertyType = radio.value; });
  });

  function updateNextBtn() {
    const btn = document.getElementById('btnNext');
    if (!btn) return;
    if (currentStep === 1) btn.disabled = !formData.service;
    else btn.disabled = false;
  }

  function showStep(n, direction = 'forward') {
    steps.forEach(s => { s.classList.remove('active', 'slide-back'); });
    progressDots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i + 1 < n) dot.classList.add('done');
      if (i + 1 === n) dot.classList.add('active');
    });
    const target = document.querySelector(`#step${n}`);
    if (target) {
      target.classList.add('active');
      if (direction === 'back') target.classList.add('slide-back');
    }
    currentStep = n;
    const btnBack = document.getElementById('btnBack');
    if (btnBack) btnBack.style.visibility = n > 1 ? 'visible' : 'hidden';
    const btnNext = document.getElementById('btnNext');
    if (btnNext) btnNext.textContent = n === 3 ? 'Submit Request ✓' : 'Continue →';
    updateNextBtn();
  }

  function validateStep2() {
    let valid = true;
    const fields = [
      { id: 'firstName', msg: 'First name is required' },
      { id: 'lastName', msg: 'Last name is required' },
      { id: 'phone', msg: 'Phone number is required' },
      { id: 'email', msg: 'Email is required' },
      { id: 'address', msg: 'Address is required' },
      { id: 'city', msg: 'City is required' },
      { id: 'zip', msg: 'ZIP code is required' },
    ];
    fields.forEach(({ id, msg }) => {
      const input = document.getElementById(id);
      const group = input?.closest('.form-group');
      if (!input?.value.trim()) {
        group?.classList.add('has-error');
        const err = group?.querySelector('.error-msg');
        if (err) err.textContent = msg;
        valid = false;
      } else {
        group?.classList.remove('has-error');
      }
    });
    // Email format
    const emailInput = document.getElementById('email');
    if (emailInput?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput.closest('.form-group')?.classList.add('has-error');
      const err = emailInput.closest('.form-group')?.querySelector('.error-msg');
      if (err) err.textContent = 'Please enter a valid email';
      valid = false;
    }
    return valid;
  }

  function collectStep2() {
    formData.firstName = document.getElementById('firstName')?.value.trim() || '';
    formData.lastName = document.getElementById('lastName')?.value.trim() || '';
    formData.phone = document.getElementById('phone')?.value.trim() || '';
    formData.email = document.getElementById('email')?.value.trim() || '';
    formData.address = document.getElementById('address')?.value.trim() || '';
    formData.city = document.getElementById('city')?.value.trim() || '';
    formData.zip = document.getElementById('zip')?.value.trim() || '';
  }

  function collectStep3() {
    formData.date = document.getElementById('prefDate')?.value || '';
    formData.notes = document.getElementById('notes')?.value.trim() || '';
  }

  function serviceLabel(s) {
    if (s === 'paver') return 'Paver Sealing';
    if (s === 'epoxy') return 'Epoxy Coatings';
    if (s === 'both') return 'Paver Sealing + Epoxy (Bundle)';
    return s;
  }

  function showConfirmation() {
    document.querySelector('.form-shell').style.display = 'none';
    document.querySelector('.form-progress').style.display = 'none';
    const conf = document.querySelector('.confirmation');
    conf.classList.add('active');

    document.getElementById('sum-name').textContent = `${formData.firstName} ${formData.lastName}`;
    document.getElementById('sum-service').textContent = serviceLabel(formData.service);
    document.getElementById('sum-address').textContent = `${formData.address}, ${formData.city}, AZ ${formData.zip}`;
    document.getElementById('sum-date').textContent = formData.date || 'Flexible';
    document.getElementById('sum-time').textContent = formData.time || 'Flexible';
    document.getElementById('conf-name').textContent = formData.firstName;
  }

  // Next button
  document.getElementById('btnNext')?.addEventListener('click', () => {
    if (currentStep === 1 && !formData.service) return;
    if (currentStep === 2) {
      if (!validateStep2()) return;
      collectStep2();
    }
    if (currentStep === 3) {
      collectStep3();
      showConfirmation();
      return;
    }
    showStep(currentStep + 1);
  });

  // Back button
  document.getElementById('btnBack')?.addEventListener('click', () => {
    if (currentStep > 1) showStep(currentStep - 1, 'back');
  });

  // Set min date on date picker
  const dateInput = document.getElementById('prefDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  showStep(1);
});

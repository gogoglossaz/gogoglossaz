(function () {
  let currentStep = 1;
  const TOTAL_STEPS = 5;
  let selectedService = null;
  let selectedTime = 'flexible';
  let originalBodyHTML = null;

  // The modal markup lives here so every page gets the same form.
  const MODAL_HTML = `
<div id="quote-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-label="Get a Free Quote">
  <div class="modal-card">

    <!-- Header -->
    <div class="modal-header">
      <img src="/assets/logo-gogo-gloss.png" alt="Go Go Gloss" class="modal-header-logo">
      <div class="modal-header-text">
        <strong>Go Go Gloss</strong>
        <span>Get Your Free Quote</span>
      </div>
      <button id="modal-close" class="modal-close" aria-label="Close">✕</button>
    </div>

    <!-- Step bar -->
    <div class="modal-steps">
      <div class="modal-step active">
        <div class="step-icon-wrap">📍</div>
        <span class="step-label">Address</span>
      </div>
      <div class="modal-step">
        <div class="step-icon-wrap">👤</div>
        <span class="step-label">Contact</span>
      </div>
      <div class="modal-step">
        <div class="step-icon-wrap">🔧</div>
        <span class="step-label">Service</span>
      </div>
      <div class="modal-step">
        <div class="step-icon-wrap">📅</div>
        <span class="step-label">Schedule</span>
      </div>
      <div class="modal-step">
        <div class="step-icon-wrap">📝</div>
        <span class="step-label">Additional</span>
      </div>
    </div>

    <!-- Body -->
    <div class="modal-body">

      <!-- Step 1: Address -->
      <div class="step-panel active" id="panel-1">
        <div class="panel-icon">📍</div>
        <h2 class="panel-heading">Where is your property?</h2>
        <p class="panel-sub">We'll confirm we service your area.</p>
        <div class="form-group">
          <label for="modal-address">Street Address *</label>
          <input type="text" id="modal-address" placeholder="123 Main St" autocomplete="street-address" required>
          <span class="field-error"></span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="modal-city">City *</label>
            <input type="text" id="modal-city" placeholder="Scottsdale" autocomplete="address-level2" required>
            <span class="field-error"></span>
          </div>
          <div class="form-group">
            <label for="modal-zip">ZIP Code *</label>
            <input type="text" id="modal-zip" placeholder="85251" autocomplete="postal-code" required>
            <span class="field-error"></span>
          </div>
        </div>
      </div>

      <!-- Step 2: Contact -->
      <div class="step-panel" id="panel-2">
        <div class="panel-icon">👤</div>
        <h2 class="panel-heading">Tell us about yourself</h2>
        <p class="panel-sub">We'll use this to send your free quote.</p>
        <div class="form-row">
          <div class="form-group">
            <label for="modal-firstName">First Name *</label>
            <input type="text" id="modal-firstName" placeholder="John" autocomplete="given-name" required>
            <span class="field-error"></span>
          </div>
          <div class="form-group">
            <label for="modal-lastName">Last Name *</label>
            <input type="text" id="modal-lastName" placeholder="Smith" autocomplete="family-name" required>
            <span class="field-error"></span>
          </div>
        </div>
        <div class="form-group">
          <label for="modal-phone">Phone Number *</label>
          <input type="tel" id="modal-phone" placeholder="(623) 555-0100" autocomplete="tel" required>
          <span class="field-error"></span>
        </div>
        <div class="form-group">
          <label for="modal-email">Email Address *</label>
          <input type="email" id="modal-email" placeholder="john@example.com" autocomplete="email" required>
          <span class="field-error"></span>
        </div>
      </div>

      <!-- Step 3: Service -->
      <div class="step-panel" id="panel-3">
        <div class="panel-icon">🔧</div>
        <h2 class="panel-heading">What service do you need?</h2>
        <p class="panel-sub">Select one option below.</p>
        <div class="service-cards">
          <div class="service-card-option" data-value="paver-sealing">
            <div class="card-emoji">🧱</div>
            <div class="card-title">Paver Sealing</div>
            <div class="card-desc">Driveways, patios, pool decks & walkways</div>
          </div>
          <div class="service-card-option" data-value="epoxy-coatings">
            <div class="card-emoji">✨</div>
            <div class="card-title">Epoxy Coatings</div>
            <div class="card-desc">Garage floors, patios & commercial spaces</div>
          </div>
          <div class="service-card-option" data-value="both">
            <span class="best-value-tag">BEST VALUE</span>
            <div class="card-emoji">💎</div>
            <div class="card-title">Both Services</div>
            <div class="card-desc">Bundle & save 10%</div>
          </div>
        </div>
        <span id="service-error" class="field-error" style="text-align:center;display:block;margin-top:8px"></span>
      </div>

      <!-- Step 4: Schedule -->
      <div class="step-panel" id="panel-4">
        <div class="panel-icon">📅</div>
        <h2 class="panel-heading">When works for you?</h2>
        <p class="panel-sub">Pick a preferred date and time.</p>
        <div class="form-group">
          <label for="modal-date">Preferred Date *</label>
          <input type="date" id="modal-date" required>
          <span class="field-error"></span>
        </div>
        <div class="form-group">
          <label>Preferred Time</label>
          <div class="time-options">
            <div class="time-option" data-value="morning">
              <div class="time-icon">🌅</div>Morning<br><small>8am – 12pm</small>
            </div>
            <div class="time-option" data-value="afternoon">
              <div class="time-icon">☀️</div>Afternoon<br><small>12pm – 5pm</small>
            </div>
            <div class="time-option selected" data-value="flexible">
              <div class="time-icon">🕐</div>Flexible<br><small>Any time</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 5: Additional -->
      <div class="step-panel" id="panel-5">
        <div class="panel-icon">📝</div>
        <h2 class="panel-heading">Anything else we should know?</h2>
        <p class="panel-sub">Optional — special requests, gate codes, questions, etc.</p>
        <div class="form-group">
          <label for="modal-notes">Additional Notes</label>
          <textarea id="modal-notes" rows="5" placeholder="E.g. I have a large driveway and two dogs — please let me know before arrival…"></textarea>
        </div>
      </div>

    </div><!-- end modal-body -->

    <!-- Footer -->
    <div class="modal-footer">
      <button id="modal-back" class="btn-modal-back hidden">← Back</button>
      <button id="modal-next" class="btn-modal-next">Continue →</button>
    </div>

  </div>
</div>
`;

  function ensureModal() {
    if (document.getElementById('quote-modal')) return;
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
  }

  // ── Open / Close ──────────────────────────────────────
  function openModal() {
    const overlay = document.getElementById('quote-modal');
    if (!overlay) return;
    resetModal();
    overlay.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = document.getElementById('quote-modal');
    if (!overlay) return;
    overlay.classList.remove('open');
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 250);
  }

  function resetModal() {
    currentStep = 1;
    selectedService = null;
    selectedTime = 'flexible';

    // Reset step bar
    document.querySelectorAll('.modal-step').forEach((s, i) => {
      s.classList.toggle('active', i === 0);
      s.classList.remove('completed');
    });

    // Reset all panels
    document.querySelectorAll('.step-panel').forEach((p, i) => {
      p.classList.remove('active', 'exit-left', 'exit-right');
      p.removeAttribute('style');
      if (i === 0) p.classList.add('active');
    });

    // Reset footer
    const back = document.getElementById('modal-back');
    const next = document.getElementById('modal-next');
    if (back) back.classList.add('hidden');
    if (next) { next.textContent = 'Continue →'; next.disabled = false; }

    // Reset service cards
    document.querySelectorAll('.service-card-option').forEach(c => c.classList.remove('selected'));
    // Reset time options
    document.querySelectorAll('.time-option').forEach(o => {
      o.classList.toggle('selected', o.dataset.value === 'flexible');
    });

    // Reset form fields
    document.querySelectorAll('#quote-modal input, #quote-modal textarea').forEach(f => f.value = '');
    document.querySelectorAll('#quote-modal .form-group').forEach(g => g.classList.remove('error'));
    document.querySelectorAll('#quote-modal .field-error').forEach(e => e.textContent = '');

    // Min date
    const datePicker = document.getElementById('modal-date');
    if (datePicker) datePicker.min = new Date().toISOString().split('T')[0];

    // Clear any lingering submit error
    document.getElementById('modal-submit-error')?.remove();

    // Restore body if confirmation was shown
    restoreModalBody();
  }

  function restoreModalBody() {
    const stepBar = document.querySelector('#quote-modal .modal-steps');
    const footer  = document.querySelector('#quote-modal .modal-footer');
    if (stepBar) stepBar.style.display = '';
    if (footer)  footer.style.display  = '';

    // If confirmation replaced the body HTML, restore original panels
    const body = document.querySelector('#quote-modal .modal-body');
    if (body && originalBodyHTML && !body.querySelector('.step-panel')) {
      body.innerHTML = originalBodyHTML;
      // Re-attach service card and time option listeners
      attachServiceCards();
      attachTimeOptions();
    }
  }

  // ── Step Navigation ───────────────────────────────────
  function goToStep(next, direction) {
    const prevPanel = document.querySelector('#quote-modal .step-panel.active');
    const nextPanel = document.getElementById('panel-' + next);
    if (!nextPanel) return;

    if (prevPanel && direction) {
      prevPanel.classList.add(direction === 'forward' ? 'exit-left' : 'exit-right');
      prevPanel.classList.remove('active');
      setTimeout(() => prevPanel.classList.remove('exit-left', 'exit-right'), 400);
    } else if (prevPanel) {
      prevPanel.classList.remove('active');
    }

    // Position next panel off-screen first, then animate in
    nextPanel.classList.add(direction === 'forward' ? 'enter-right' : direction === 'back' ? 'enter-left' : '');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      nextPanel.classList.remove('enter-right', 'enter-left');
      nextPanel.classList.add('active');
    }));

    // Update step bar
    document.querySelectorAll('.modal-step').forEach((s, i) => {
      s.classList.remove('active', 'completed');
      if (i + 1 < next)  s.classList.add('completed');
      if (i + 1 === next) s.classList.add('active');
    });

    // Update footer
    const back = document.getElementById('modal-back');
    const nextBtn = document.getElementById('modal-next');
    if (back)    back.classList.toggle('hidden', next === 1);
    if (nextBtn) nextBtn.textContent = next === TOTAL_STEPS ? 'Submit →' : 'Continue →';

    currentStep = next;
  }

  // ── Validation ────────────────────────────────────────
  function validateStep(step) {
    let valid = true;

    document.querySelectorAll(`#panel-${step} [required]`).forEach(field => {
      const group = field.closest('.form-group');
      const err   = group?.querySelector('.field-error');
      if (!field.value.trim()) {
        valid = false;
        group?.classList.add('error');
        if (err) err.textContent = 'This field is required';
      } else {
        group?.classList.remove('error');
        if (err) err.textContent = '';
      }
    });

    if (step === 3 && !selectedService) {
      valid = false;
      const err = document.getElementById('service-error');
      if (err) err.textContent = 'Please select a service to continue';
    }

    return valid;
  }

  // ── Submit ────────────────────────────────────────────
  async function submitForm() {
    const nextBtn = document.getElementById('modal-next');
    if (nextBtn) { nextBtn.textContent = 'Sending…'; nextBtn.disabled = true; }

    const payload = {
      'Street Address':  document.getElementById('modal-address')?.value,
      'City':            document.getElementById('modal-city')?.value,
      'ZIP Code':        document.getElementById('modal-zip')?.value,
      'First Name':      document.getElementById('modal-firstName')?.value,
      'Last Name':       document.getElementById('modal-lastName')?.value,
      'email':           document.getElementById('modal-email')?.value,
      'Phone':           document.getElementById('modal-phone')?.value,
      'Service':         selectedService,
      'Preferred Date':  document.getElementById('modal-date')?.value,
      'Preferred Time':  selectedTime,
      'Notes':           document.getElementById('modal-notes')?.value || '(none)',
    };

    try {
      const res = await fetch('https://formspree.io/f/xrenodyk', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (res.ok) {
        showConfirmation();
      } else {
        const json = await res.json().catch(() => ({}));
        const msg  = json?.errors?.[0]?.message || 'Submission failed. Please call us directly.';
        showSubmitError(msg, nextBtn);
      }
    } catch {
      showSubmitError('Network error. Please call us directly.', nextBtn);
    }
  }

  function showSubmitError(msg, nextBtn) {
    if (nextBtn) { nextBtn.textContent = 'Submit →'; nextBtn.disabled = false; }
    let err = document.getElementById('modal-submit-error');
    if (!err) {
      err = document.createElement('p');
      err.id = 'modal-submit-error';
      err.style.cssText = 'color:#ef4444;font-size:0.82rem;text-align:center;margin:0;padding:0 24px 12px';
      document.querySelector('#quote-modal .modal-footer')?.before(err);
    }
    err.textContent = msg;
  }

  function showConfirmation() {
    const stepBar = document.querySelector('#quote-modal .modal-steps');
    const footer  = document.querySelector('#quote-modal .modal-footer');
    const body    = document.querySelector('#quote-modal .modal-body');

    if (stepBar) stepBar.style.display = 'none';
    if (footer)  footer.style.display  = 'none';

    const firstName = document.getElementById('modal-firstName')?.value || 'there';
    if (body) {
      body.innerHTML = `
        <div class="confirmation-panel">
          <svg class="check-circle" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="36" r="32"/>
            <path d="M20 37 l12 12 l20-22"/>
          </svg>
          <h2>You're all set, ${firstName}!</h2>
          <p>We'll review your request and be in touch within <strong>24 hours</strong>.</p>
          <a href="tel:6023649304" class="confirmation-phone">(602) 364-9304</a>
        </div>`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        body.querySelector('.check-circle')?.classList.add('animate');
      }));
    }
  }

  // ── Blur Validation ───────────────────────────────────
  function attachBlurValidation() {
    document.querySelectorAll('#quote-modal [required]').forEach(field => {
      field.addEventListener('blur', () => {
        const group = field.closest('.form-group');
        const err   = group?.querySelector('.field-error');
        if (!field.value.trim()) {
          group?.classList.add('error');
          if (err) err.textContent = 'This field is required';
        } else {
          group?.classList.remove('error');
          if (err) err.textContent = '';
        }
      });
    });
  }

  function attachServiceCards() {
    document.querySelectorAll('.service-card-option').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.service-card-option').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedService = card.dataset.value;
        const err = document.getElementById('service-error');
        if (err) err.textContent = '';
      });
    });
  }

  function attachTimeOptions() {
    document.querySelectorAll('.time-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.time-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedTime = opt.dataset.value;
      });
    });
  }

  // ── Init ──────────────────────────────────────────────
  function init() {
    ensureModal();
    // Save original body HTML for restoration after confirmation
    const body = document.querySelector('#quote-modal .modal-body');
    if (body) originalBodyHTML = body.innerHTML;

    // Open triggers
    document.addEventListener('click', e => {
      const trigger = e.target.closest('.open-quote-modal');
      if (trigger) { e.preventDefault(); openModal(); }
    });

    // Close button + overlay click + Escape
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('quote-modal')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Next / Back
    document.getElementById('modal-next')?.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;
      if (currentStep === TOTAL_STEPS) { submitForm(); return; }
      goToStep(currentStep + 1, 'forward');
    });
    document.getElementById('modal-back')?.addEventListener('click', () => {
      if (currentStep > 1) goToStep(currentStep - 1, 'back');
    });

    attachServiceCards();
    attachTimeOptions();
    attachBlurValidation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

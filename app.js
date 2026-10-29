(() => {
  const modal = document.querySelector('[data-condition="open"]');
  const form = modal.querySelector('form');
  const conditions = name => modal.querySelector(`[data-condition="${name}"]`);
  const topic = document.getElementById('f-topic');
  const options = {
    openForm: 'Не знаю, подскажите',
    openG1: '«Движение и речь», 4–9 лет',
    openG2: 'ОФП с элементами ЛФК, 7–14 лет',
    openG3: '«Умные мячики», 8–15 лет',
    openI1: 'Логопед', openI2: 'Нейропсихолог'
  };
  let returnFocus;
  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    returnFocus?.focus();
  }
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'closeForm') return close();
    if (action === 'onOverlay') { if (e.target === button) close(); return; }
    if (!(action in options)) return;
    returnFocus = button;
    modal.hidden = false;
    conditions('form').hidden = false;
    conditions('sent').hidden = true;
    conditions('hasErr').hidden = true;
    topic.value = options[action];
    modal.querySelector('[role="dialog"]').setAttribute('aria-labelledby', 'req-title');
    document.body.style.overflow = 'hidden';
    document.getElementById('f-name').focus();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('f-name');
    const phone = document.getElementById('f-phone');
    const validName = !!name.value.trim();
    const validPhone = /^\d{10,15}$/.test(phone.value.replace(/\D/g, ''));
    name.setAttribute('aria-invalid', String(!validName));
    phone.setAttribute('aria-invalid', String(!validPhone));
    conditions('hasErr').hidden = validName && validPhone;
    if (!validName || !validPhone) { (validName ? phone : name).focus(); return; }
    conditions('form').hidden = true;
    conditions('sent').hidden = false;
    modal.querySelector('[role="dialog"]').setAttribute('aria-labelledby', 'req-title-sent');
    conditions('sent').querySelector('button').focus();
    form.reset();
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key !== 'Tab') return;
    const elements = [...modal.querySelectorAll('button,a[href],input,select')].filter(el => el.getClientRects().length);
    const first = elements[0], last = elements.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();

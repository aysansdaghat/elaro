(function () {
  const select = document.getElementById('service-category');
  const search = document.getElementById('service-search');
  const list   = document.getElementById('services-list');
  const chips  = document.getElementById('category-chips');
  const count  = document.getElementById('result-count');
  const reset  = document.getElementById('reset-filters');
  const clear  = document.getElementById('search-clear');
  if (!select || !search || !list || !chips) return;

  const fire = (el, types) =>
    types.forEach(t => el.dispatchEvent(new Event(t, { bubbles: true })));

  // انیمیشن پله‌ای کارت‌ها (حداکثر ۱۲ تأخیر تا صفحه طولانی نشه)
  function animateCards() {
    list.querySelectorAll('.card').forEach((card, i) => {
      card.style.setProperty('--i', Math.min(i, 12));
      card.classList.add('card-enter');
    });
  }

  function sync() {
    chips.querySelectorAll('.chip').forEach(c => {
      const on = c.dataset.value === select.value;
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on);
    });
    const first = select.options[0] ? select.options[0].value : '';
    clear.hidden = search.value === '';
    reset.hidden = search.value.trim() === '' && select.value === first;
    const n = list.querySelectorAll('.card').length;
    count.textContent = n
      ? n.toLocaleString('fa-IR') + ' خدمت'
      : 'خدمتی با این مشخصات پیدا نشد';
  }

  function buildChips() {
    chips.innerHTML = '';
    [...select.options].forEach(o => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.dataset.value = o.value;
      b.textContent = o.textContent.trim();
      b.addEventListener('click', () => {
        select.value = o.value;
        fire(select, ['input', 'change']);
        sync();
      });
      chips.appendChild(b);
    });
    sync();
  }

  clear.addEventListener('click', () => {
    search.value = '';
    fire(search, ['input']);
    search.focus();
    sync();
  });

  reset.addEventListener('click', () => {
    if (select.options[0]) select.value = select.options[0].value;
    search.value = '';
    fire(select, ['input', 'change']);
    fire(search, ['input']);
    sync();
  });

  search.addEventListener('input', sync);
  select.addEventListener('change', sync);

  new MutationObserver(buildChips).observe(select, { childList: true });
  new MutationObserver(() => { sync(); animateCards(); })
    .observe(list, { childList: true });

  if (select.options.length) buildChips();
  animateCards();
})();
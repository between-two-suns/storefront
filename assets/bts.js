(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

  const initMenu = () => {
    document.querySelectorAll('.bts-menu').forEach((details) => {
      details.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => details.removeAttribute('open'));
      });

      const closeLabel = details.querySelector('.bts-menu__close');
      if (closeLabel) {
        closeLabel.addEventListener('click', () => details.removeAttribute('open'));
      }
    });
  };

  const initHero = (root) => {
    const hero = root.querySelector('[data-bts-hero]');
    if (!hero || reduceMotion) return;

    let ticking = false;

    const update = () => {
      const rect = hero.getBoundingClientRect();
      const viewport = Math.max(window.innerHeight, 1);
      const progress = clamp((-rect.top) / Math.max(rect.height * .65, 1));
      hero.style.setProperty('--bts-hero-shift', progress.toFixed(4));
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  };

  const initEnvironment = (root) => {
    const environment = root.querySelector('[data-bts-environment]');
    if (!environment) return;

    const buttons = [...environment.querySelectorAll('[data-env-button]')];
    const index = environment.querySelector('[data-env-index]');
    const title = environment.querySelector('[data-env-title]');
    const copy = environment.querySelector('[data-env-copy]');

    const setState = (button) => {
      environment.dataset.env = button.dataset.envButton;

      buttons.forEach((item) => {
        item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
      });

      if (index) index.textContent = button.dataset.index;
      if (title) title.textContent = button.dataset.title;
      if (copy) copy.textContent = button.dataset.copy;
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => setState(button));
    });
  };

  const initRoutine = (root) => {
    const routine = root.querySelector('[data-bts-routine]');
    if (!routine) return;

    const timeButtons = [...routine.querySelectorAll('[data-time-button]')];
    const count = routine.querySelector('[data-routine-count]');
    const addButton = routine.querySelector('[data-bts-add-routine]');

    const setTime = (time) => {
      routine.dataset.time = time;

      timeButtons.forEach((button) => {
        button.setAttribute('aria-pressed', button.dataset.timeButton === time ? 'true' : 'false');
      });

      if (count) {
        count.textContent = time === 'pm' ? '3 STEPS · PM' : '4 STEPS · AM';
      }
    };

    timeButtons.forEach((button) => {
      button.addEventListener('click', () => setTime(button.dataset.timeButton));
    });

    if (!addButton) return;

    addButton.addEventListener('click', async () => {
      if (addButton.disabled) return;

      const time = routine.dataset.time || 'am';
      const items = [...routine.querySelectorAll('[data-routine-item]')]
        .filter((item) => time === 'am' || item.dataset.time.includes('pm'))
        .map((item) => Number(item.dataset.variantId))
        .filter(Boolean)
        .map((id) => ({ id, quantity: 1 }));

      const expected = time === 'am' ? 4 : 3;

      if (items.length !== expected) {
        addButton.textContent = 'ROUTINE NOT READY';
        return;
      }

      const originalText = addButton.innerHTML;
      addButton.disabled = true;
      addButton.textContent = 'ADDING ROUTINE…';

      try {
        const rootPath = window.Shopify?.routes?.root || '/';
        const response = await fetch(`${rootPath}cart/add.js`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ items })
        });

        if (!response.ok) throw new Error(`Cart add failed: ${response.status}`);

        addButton.textContent = 'ROUTINE ADDED ✓';
        window.setTimeout(() => window.location.assign(`${rootPath}cart`), 300);
      } catch (error) {
        console.error('[BTS] Could not add routine', error);
        addButton.disabled = false;
        addButton.innerHTML = originalText;
      }
    });
  };

  const initExperience = () => {
    document.querySelectorAll('[data-bts-experience]').forEach((root) => {
      initHero(root);
      initEnvironment(root);
      initRoutine(root);
    });
  };

  initMenu();
  initExperience();

  document.addEventListener('shopify:section:load', () => {
    initMenu();
    initExperience();
  });
})();

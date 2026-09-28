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
    const shell = root.querySelector('[data-bts-hero]');
    const stage = shell?.querySelector('.bts-stage--hero');
    if (!shell || !stage || reduceMotion) return;

    let ticking = false;

    const update = () => {
      const rect = shell.getBoundingClientRect();
      const travel = Math.max(shell.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel);
      stage.style.setProperty('--hero-progress', progress.toFixed(4));
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
    const shell = root.querySelector('[data-bts-environment]');
    const stage = shell?.querySelector('.bts-stage--environment');
    const buttons = [...(stage?.querySelectorAll('[data-env-button]') || [])];
    const title = stage?.querySelector('[data-env-title]');
    const copy = stage?.querySelector('[data-env-copy]');
    const index = stage?.querySelector('.bts-environment__index');

    if (!shell || !stage || !buttons.length || !title || !copy || !index) return;

    const setState = (button) => {
      const environment = button.dataset.envButton;
      stage.dataset.env = environment;

      buttons.forEach((item) => {
        item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
      });

      index.textContent = `${button.dataset.index} / 05`;
      title.textContent = button.dataset.title;
      copy.textContent = button.dataset.copy;
    };

    buttons.forEach((button, buttonIndex) => {
      button.addEventListener('click', () => {
        setState(button);

        if (reduceMotion) return;

        const travel = Math.max(shell.offsetHeight - window.innerHeight, 0);
        const fraction = buttons.length === 1 ? 0 : buttonIndex / (buttons.length - 1);
        const top = window.scrollY + shell.getBoundingClientRect().top + travel * fraction;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    if (reduceMotion) return;

    let lastIndex = -1;
    let ticking = false;

    const updateFromScroll = () => {
      const rect = shell.getBoundingClientRect();
      const travel = Math.max(shell.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel);
      const nextIndex = Math.min(buttons.length - 1, Math.floor(progress * buttons.length));

      if (nextIndex !== lastIndex) {
        lastIndex = nextIndex;
        setState(buttons[nextIndex]);
      }

      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  };

  const initRoutine = (root) => {
    const routine = root.querySelector('[data-bts-routine]');
    if (!routine) return;

    const timeButtons = [...routine.querySelectorAll('[data-time-button]')];
    const count = routine.querySelector('[data-routine-count]');
    const addButton = routine.querySelector('[data-bts-add-routine]');
    const defense = routine.querySelector('[data-defense]');

    const setTime = (time) => {
      routine.dataset.time = time;

      timeButtons.forEach((button) => {
        button.setAttribute('aria-pressed', button.dataset.timeButton === time ? 'true' : 'false');
      });

      if (defense) {
        defense.setAttribute('aria-hidden', time === 'pm' ? 'true' : 'false');
      }

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
        addButton.textContent = 'SELECT ROUTINE PRODUCTS FIRST';
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

        if (!response.ok) {
          throw new Error(`Cart add failed: ${response.status}`);
        }

        addButton.textContent = 'ROUTINE ADDED ✓';
        window.setTimeout(() => {
          window.location.assign(`${rootPath}cart`);
        }, 350);
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

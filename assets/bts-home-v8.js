(() => {
  const root = document.querySelector('[data-bts8]');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';

  const PRODUCTS = {
    reset: {
      image: 'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-reset-transparent.webp?v=1790629352',
      step: { en:'01 · CLEANSE', ar:'01 · تنظيف' },
      name: 'Daily Reset Cleanser',
      size: '200 mL',
      benefit: {
        en:'Removes excess oil and daily buildup while helping skin maintain hydration.',
        ar:'ينظف الدهون الزائدة وتراكمات اليوم مع الحفاظ على ترطيب البشرة وراحتها.'
      },
      claims: {
        en:['NON-STRIPPING','SOAP-FREE','NON-COMEDOGENIC'],
        ar:['غير مُجرّد للترطيب','خالٍ من الصابون','غير مسبب لانسداد المسام']
      },
      formula: {
        en:[
          ['Zinc PCA','Chosen for oily-to-combination skin to support oil balance.'],
          ['Centella','A soothing botanical that helps keep the cleansing step comfortable.'],
          ['Panthenol + Glycerin','Hydration and comfort support so skin feels fresh after rinsing.']
        ],
        ar:[
          ['Zinc PCA','مناسب للبشرة الدهنية والمختلطة للمساعدة في توازن إفراز الدهون.'],
          ['Centella','مكوّن نباتي مهدئ يساعد على الحفاظ على راحة البشرة أثناء التنظيف.'],
          ['Panthenol + Glycerin','دعم للترطيب والراحة عشان البشرة تفضل منتعشة بعد الشطف.']
        ]
      },
      detail: {
        en:'A daily gel cleanser with Zinc PCA, Panthenol and Centella. Removes excess oil and environmental buildup without stripping, while hydrating and leaving skin fresh and comfortable.',
        ar:'غسول جل يومي يحتوي على Zinc PCA والبانثينول والسنتيلا. ينظف الدهون الزائدة وتراكمات اليوم من غير ما يجرّد البشرة من ترطيبها، ويتركها منتعشة ومريحة.'
      },
      inci:'Aqua, Sodium Lauryl Sulfosuccinate, Cocamidopropyl Betaine, Coco-Glucoside, Glycerin, Lauryl Glucoside, Propylene Glycol, PEG-120 Methyl Glucose Dioleate, Phenoxyethanol, PEG-7 Glyceryl Cocoate, Panthenol, Poloxamer 184, Polyquaternium-10, Aloe Barbadensis Leaf Extract, Centella Asiatica Extract, Sodium PCA, Zinc PCA, Ethylhexylglycerin, EDTA, Allantoin, Glycyrrhiza Glabra Root Extract, Citric Acid.'
    },
    clarity: {
      image: 'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-clarity-transparent.webp?v=1790629358',
      step: { en:'02 · TREAT', ar:'02 · عناية' },
      name: 'Clarity Serum',
      size: '30 mL',
      benefit: {
        en:'Helps even skin tone, reduce the appearance of dark spots and control excess oil while hydrating.',
        ar:'يساعد على توحيد مظهر لون البشرة وتقليل مظهر البقع الداكنة والتحكم في الدهون الزائدة مع الحفاظ على الترطيب.'
      },
      claims: {
        en:['NIACINAMIDE','TRANEXAMIC ACID','HYALURONIC ACID'],
        ar:['NIACINAMIDE','TRANEXAMIC ACID','HYALURONIC ACID']
      },
      formula: {
        en:[
          ['Niacinamide','Supports more even-looking tone, oil balance and skin-barrier function.'],
          ['Tranexamic Acid','Selected to target the appearance of stubborn uneven tone and dark spots.'],
          ['Glycerin + Sodium Hyaluronate','Hydration stays built into the treatment rather than added as an afterthought.']
        ],
        ar:[
          ['Niacinamide','يساعد على توحيد مظهر البشرة وتوازن الدهون ودعم حاجز البشرة.'],
          ['Tranexamic Acid','موجود لاستهداف مظهر البقع الداكنة وعدم توحّد اللون.'],
          ['Glycerin + Sodium Hyaluronate','الترطيب جزء أساسي من التركيبة، مش خطوة ثانوية.']
        ]
      },
      detail: {
        en:'A daily serum with Niacinamide, Tranexamic Acid and Hyaluronic Acid. Helps even skin tone and reduce the appearance of dark spots while controlling excess oil and hydrating skin.',
        ar:'سيروم يومي بنياسيناميد وترانيكساميك أسيد وهيالورونيك أسيد. يساعد على توحيد مظهر لون البشرة وتقليل مظهر البقع الداكنة مع التحكم في الدهون الزائدة والحفاظ على الترطيب.'
      },
      inci:'Aqua, Niacinamide, Glycerin, Tranexamic Acid, Propylene Glycol, Phenoxyethanol, Panthenol, Xylitylglucoside, Anhydroxylitol, Xylitol, Sodium Hyaluronate, Ammonium Acryloyldimethyltaurate/VP Copolymer, Ethylhexylglycerin, EDTA, Allantoin.'
    },
    barrier: {
      image: 'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-barrier-transparent.webp?v=1790629363',
      step: { en:'03 · HYDRATE', ar:'03 · ترطيب' },
      name: 'Daily Barrier Moisturizing Cream',
      size: '50 g',
      benefit: {
        en:'Hydrates without heaviness, helps control oil and supports the skin barrier.',
        ar:'يرطب من غير إحساس تقيل، يساعد في التحكم في الدهون ويدعم حاجز البشرة.'
      },
      claims: {
        en:['OIL-CONTROL','NON-COMEDOGENIC','FRAGRANCE-FREE'],
        ar:['تحكم في الدهون','غير مسبب لانسداد المسام','خالٍ من العطر']
      },
      formula: {
        en:[
          ['Ceramides','Barrier lipids chosen to support the skin’s protective structure.'],
          ['Niacinamide + Zinc PCA','A pairing that fits oily-to-combination skin while supporting barrier care.'],
          ['Squalane + Glycerin + Panthenol','Hydration and comfort without turning the formula into a heavy cream.']
        ],
        ar:[
          ['Ceramides','دهون أساسية تدعم البنية الواقية لحاجز البشرة.'],
          ['Niacinamide + Zinc PCA','تركيبة مناسبة للبشرة الدهنية والمختلطة مع دعم حاجز البشرة.'],
          ['Squalane + Glycerin + Panthenol','ترطيب وراحة من غير ما الكريم يحسّس البشرة بثقل.']
        ]
      },
      detail: {
        en:'A daily moisturizer with Ceramides, Niacinamide and Zinc PCA. Hydrates without heaviness, controls oil and strengthens the skin barrier.',
        ar:'مرطب يومي بالسيراميدات والنياسيناميد وZinc PCA. يرطب من غير ثقل، يساعد في التحكم في الدهون ويدعم حاجز البشرة.'
      },
      inci:'Aqua, Glycerin, Niacinamide, Propylene Glycol, Caprylic/Capric Triglyceride, Glyceryl Stearate, PEG-100 Stearate, Cetearyl Alcohol, Isohexadecane, Squalane, Dimethicone, Panthenol, Phenoxyethanol, Ammonium Acryloyldimethyltaurate/VP Copolymer, Zinc PCA, Sodium Hyaluronate, Sodium PCA, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Sodium Lauroyl Lactylate, Ethylhexylglycerin, Cholesterol, Carbomer, Disodium EDTA, Xanthan Gum.'
    },
    defense: {
      image: 'https://cdn.shopify.com/s/files/1/0842/8122/9570/files/bts-defense-transparent.webp?v=1790629368',
      step: { en:'04 · PROTECT', ar:'04 · حماية' },
      name: 'Daily Defense Sunscreen SPF 50',
      size: '50 g',
      benefit: {
        en:'Broad-spectrum SPF 50 protection in a lightweight, fast-absorbing formula with no white cast.',
        ar:'حماية واسعة الطيف SPF 50 بتركيبة خفيفة وسريعة الامتصاص من غير أثر أبيض.'
      },
      claims: {
        en:['HYDRATING','NO WHITE CAST','NON-GREASY'],
        ar:['مرطب','من غير أثر أبيض','غير دهني']
      },
      formula: {
        en:[
          ['UVA + UVB Filters','A multi-filter system provides broad-spectrum daily protection.'],
          ['Niacinamide + Panthenol','Support hydration and skin comfort alongside UV protection.'],
          ['Bisabolol','Included for its soothing role in a formula designed for daily wear.']
        ],
        ar:[
          ['UVA + UVB Filters','نظام فلاتر متعدد يوفر حماية يومية واسعة الطيف.'],
          ['Niacinamide + Panthenol','يدعمان الترطيب وراحة البشرة بجانب الحماية من الأشعة.'],
          ['Bisabolol','موجود لدعم راحة البشرة في تركيبة معمولة للاستخدام اليومي.']
        ]
      },
      detail: {
        en:'A daily SPF 50 sunscreen with Niacinamide, Panthenol and Bisabolol. Provides broad-spectrum UVA/UVB protection in a lightweight, fast-absorbing formula with no white cast.',
        ar:'واقي شمس يومي SPF 50 بالنياسيناميد والبانثينول والبيسابولول. يوفر حماية واسعة الطيف من UVA وUVB بتركيبة خفيفة وسريعة الامتصاص ومن غير أثر أبيض.'
      },
      inci:'Aqua, C12-15 Alkyl Benzoate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Ethylhexyl Methoxycinnamate, Ethylhexyl Salicylate, Bis-PEG/PPG-16/16 PEG/PPG-16/16 Dimethicone, Propylene Glycol, Glycerin, Methyl Methacrylate Crosspolymer, Niacinamide, Cetearyl Alcohol, Ammonium Acryloyldimethyltaurate/VP Copolymer, Caprylic/Capric Triglyceride, Caprylyl Methicone, Dimethicone, Phenoxyethanol, Panthenol, Bisabolol, Aloe Barbadensis Leaf Extract, Tocopheryl Acetate, Triethanolamine, Ethylhexylglycerin, EDTA.'
    }
  };

  // Scenario B WORKING PROTOTYPE prices (EGP). Not locked. No checkout.
  const PRICES = { reset:399, clarity:499, barrier:449, defense:499 };
  const WORDS = { reset:'RESET', clarity:'CLARITY', barrier:'BARRIER', defense:'DEFENSE' };
  const ORDER = ['reset','clarity','barrier','defense'];
  const ROUTINE = { list:1846, price:1661, save:185, pct:10 };
  const egp = n => 'EGP ' + n.toLocaleString('en-US');
  const tok = n => '<bdi dir="ltr">' + egp(n) + '</bdi>';

  const COPY = {
    en: {
      navProducts:'Products', navRoutine:'Routine', bag:'Bag',
      heroIndex:'Cleanser · Serum · Cream · SPF 50',
      heroTitle:'fresh skin. always.',
      heroBody:'Four light-textured essentials that do their job and disappear into your day.',
      fullRoutine4:'Full routine · 4 products', save:'Save', shopSingle:'Shop individually · from',
      meetKicker:'The four', meetTitle:'Everything you need. Nothing extra.',
      whyTitle:'Why it works', whySub:'The formula, in plain language.',
      addTo:'Add to routine', inRoutine:'In routine', details:'Full details',
      routineKicker:'Your routine', routineTitle:'Four in the morning. Three at night.',
      am:'AM', pm:'PM', amSteps:'steps', pmSteps:'steps',
      cleanse:'Cleanse', treat:'Treat', hydrate:'Hydrate', protect:'Protect', morningOnly:'Morning only',
      amCopy:'Cleanse. Treat. Hydrate. Protect.', pmCopy:'Cleanse. Treat. Hydrate. SPF stays for the morning.',
      fullRoutine:'Full routine',
      logicKicker:'Climate-adapted, underneath', logicTitle:'Light on skin. Serious in the formula.',
      logic1t:'Cleansing without stripping', logic1b:'Soap-free gel with Zinc PCA and Centella. Skin feels clean and comfortable, not tight.',
      logic2t:'Barrier support without heaviness', logic2b:'Ceramides, Niacinamide and Squalane in a cream that hydrates without a heavy feel.',
      logic3t:'SPF 50 with no white cast', logic3b:'Broad-spectrum UVA/UVB protection in a lightweight, fast-absorbing, non-greasy finish.',
      endLine:'fresh skin. always.',
      drawerKicker:'Your routine', products:n => n+(n===1?' product':' products'),
      empty:'Nothing selected yet. Pick a product or take the full routine.',
      remove:'Remove', listValue:'List value', subtotal:'Subtotal', routinePrice:'Full routine price',
      youSave:'You save', complete:'Complete the routine', completeHint:n => 'Add the other '+n+' to get the full routine price.',
      checkoutDisabled:'Checkout opens at launch',
      drawerNote:'Prototype preview. Prices shown are working launch prices and may change. Checkout is not active yet.',
      fullInci:'Full ingredient list'
    },
    ar: {
      navProducts:'المنتجات', navRoutine:'الروتين', bag:'الشنطة',
      heroIndex:'غسول · سيروم · كريم · SPF 50',
      heroTitle:'بشرة منتعشة. دايمًا.',
      heroBody:'4 أساسيات بقوام خفيف، بتعمل شغلها وتختفي في يومك.',
      fullRoutine4:'الروتين كامل · 4 منتجات', save:'وفّري', shopSingle:'اشتري كل منتج لوحده · من',
      meetKicker:'الأربعة', meetTitle:'كل اللي محتاجاه. ولا حاجة زيادة.',
      whyTitle:'ليه التركيبة دي؟', whySub:'المكونات، بطريقة بسيطة وواضحة.',
      addTo:'ضيفيه للروتين', inRoutine:'في الروتين', details:'كل التفاصيل',
      routineKicker:'روتينك', routineTitle:'4 خطوات الصبح. 3 بالليل.',
      am:'الصبح', pm:'بالليل', amSteps:'خطوات', pmSteps:'خطوات',
      cleanse:'تنظيف', treat:'عناية', hydrate:'ترطيب', protect:'حماية', morningOnly:'الصبح بس',
      amCopy:'تنظيف. عناية. ترطيب. حماية.', pmCopy:'تنظيف. عناية. ترطيب. واقي الشمس للصبح بس.',
      fullRoutine:'الروتين كامل',
      logicKicker:'متكيفة مع المناخ، من جوه التركيبة', logicTitle:'خفيفة على البشرة. جادة في التركيبة.',
      logic1t:'تنظيف من غير ما يجرّد البشرة', logic1b:'جل خالٍ من الصابون بـ Zinc PCA والسنتيلا. البشرة تحس إنها نضيفة ومرتاحة، مش مشدودة.',
      logic2t:'دعم لحاجز البشرة من غير ثقل', logic2b:'سيراميدات ونياسيناميد وسكوالين في كريم بيرطب من غير إحساس تقيل.',
      logic3t:'SPF 50 من غير أثر أبيض', logic3b:'حماية واسعة الطيف UVA/UVB بتركيبة خفيفة وسريعة الامتصاص وغير دهنية.',
      endLine:'بشرة منتعشة. دايمًا.',
      drawerKicker:'روتينك', products:n => n+(n===1?' منتج':' منتجات'),
      empty:'لسه ما اخترتيش حاجة. اختاري منتج أو خدي الروتين كامل.',
      remove:'شيلي', listValue:'السعر الأصلي', subtotal:'الإجمالي', routinePrice:'سعر الروتين كامل',
      youSave:'هتوفّري', complete:'كمّلي الروتين', completeHint:n => 'ضيفي الـ '+n+' الباقيين وخدي سعر الروتين كامل.',
      checkoutDisabled:'الدفع هيفتح مع الإطلاق',
      drawerNote:'نسخة تجريبية. الأسعار المعروضة أسعار إطلاق مبدئية وممكن تتغير. الدفع مش متفعّل لسه.',
      fullInci:'قائمة المكونات كاملة'
    }
  };

  const selected = new Set();
  let language = 'en';
  let activeProduct = 'reset';
  let routineTime = 'am';

  const $ = (s, scope=root) => scope.querySelector(s);
  const $$ = (s, scope=root) => [...scope.querySelectorAll(s)];
  const t = k => COPY[language][k];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderI18n() {
    $$('[data-i18n]').forEach(el => {
      const v = t(el.dataset.i18n);
      if (typeof v === 'string') el.textContent = v;
    });
    $$('.bts8-arrow').forEach(a => { a.textContent = language === 'ar' ? '←' : '→'; });
  }

  function renderProduct() {
    const p = PRODUCTS[activeProduct];
    const stage = $('[data-bts8-stage]');
    stage.dataset.selected = activeProduct;
    const idx = ORDER.indexOf(activeProduct);
    stage.style.setProperty('--cols', ORDER.map((k,i) => i === idx ? '2.3fr' : '1fr').join(' '));
    $$('[data-bts8-select]').forEach(btn => {
      const on = btn.dataset.bts8Select === activeProduct;
      btn.classList.toggle('is-selected', on);
      btn.classList.toggle('is-added', selected.has(btn.dataset.bts8Select));
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $('[data-bts8-step]').textContent = p.step[language];
    $('[data-bts8-name]').textContent = p.name;
    $('[data-bts8-size]').textContent = p.size;
    $('[data-bts8-price]').textContent = egp(PRICES[activeProduct]);
    $('[data-bts8-benefit]').textContent = p.benefit[language];
    $('[data-bts8-claims]').innerHTML = p.claims[language].map(x => '<span>'+x+'</span>').join('');
    $('[data-bts8-formula]').innerHTML = p.formula[language].map(row =>
      '<div class="bts8-formulaitem"><strong dir="ltr">'+row[0]+'</strong><p>'+row[1]+'</p></div>'
    ).join('');
    const toggle = $('[data-bts8-toggle-selected]');
    const inR = selected.has(activeProduct);
    toggle.dataset.bts8ToggleSelected = activeProduct;
    toggle.setAttribute('aria-pressed', inR ? 'true' : 'false');
    toggle.classList.toggle('is-added', inR);
    toggle.innerHTML = inR
      ? '<span class="bts8-btn__label">'+t('inRoutine')+' ✓</span>'
      : '<span class="bts8-btn__label">'+t('addTo')+' — '+tok(PRICES[activeProduct])+'</span>';
  }

  function renderRoutine() {
    const routine = $('[data-bts8-routine]');
    routine.dataset.time = routineTime;
    $$('[data-bts8-time]').forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.bts8Time === routineTime ? 'true' : 'false'));
    $('[data-bts8-routine-copy]').textContent = routineTime === 'am' ? t('amCopy') : t('pmCopy');
    const def = $('[data-routine-pack="defense"]');
    def.setAttribute('aria-disabled', routineTime === 'pm' ? 'true' : 'false');
  }

  function renderCount() {
    $('[data-bts8-count]').textContent = String(selected.size);
    $$('[data-bts8-select]').forEach(btn => btn.classList.toggle('is-added', selected.has(btn.dataset.bts8Select)));
  }

  function renderAll() {
    renderI18n(); renderProduct(); renderRoutine(); renderCount();
    if (!drawer.hidden) buildDrawer();
  }

  function setLanguage(next) {
    language = next;
    root.dataset.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    root.lang = language;
    $('[data-bts8-lang]').textContent = language === 'ar' ? 'EN' : 'AR';
    renderAll();
  }

  $$('[data-bts8-select]').forEach(btn => btn.addEventListener('click', () => {
    activeProduct = btn.dataset.bts8Select;
    renderProduct();
  }));

  $$('[data-bts8-pick]').forEach(btn => btn.addEventListener('click', () => {
    activeProduct = btn.dataset.bts8Pick;
    renderProduct();
    $('#products').scrollIntoView({behavior: reduced() ? 'auto' : 'smooth'});
  }));

  $('[data-bts8-toggle-selected]').addEventListener('click', e => {
    const key = e.currentTarget.dataset.bts8ToggleSelected;
    if (selected.has(key)) { selected.delete(key); renderProduct(); renderCount(); }
    else { selected.add(key); renderProduct(); renderCount(); openDrawer(e.currentTarget); }
  });

  $$('[data-bts8-time]').forEach(btn => btn.addEventListener('click', () => {
    routineTime = btn.dataset.bts8Time;
    renderRoutine();
  }));

  $('[data-bts8-lang]').addEventListener('click', () => setLanguage(language === 'en' ? 'ar' : 'en'));

  /* Drawer */
  const drawer = $('[data-bts8-drawer]');
  let previousFocus = null;

  function buildDrawer() {
    const keys = ORDER.filter(k => selected.has(k));
    $('[data-bts8-drawer-title]').textContent = t('products')(keys.length);
    const items = $('[data-bts8-drawer-items]');
    items.innerHTML = keys.length ? keys.map(key => {
      const p = PRODUCTS[key];
      return '<div class="bts8-draweritem bts8-draweritem--'+key+'"><span class="bts8-draweritem__img"><img src="'+p.image+'" alt=""></span>'+
        '<div><strong dir="ltr">'+p.name+'</strong><span dir="ltr">'+p.size+'</span></div>'+
        '<div class="bts8-draweritem__end"><b>'+tok(PRICES[key])+'</b><button type="button" data-bts8-remove="'+key+'">'+t('remove')+'</button></div></div>';
    }).join('') : '<p class="bts8-drawer__empty">'+t('empty')+'</p>';

    const list = keys.reduce((s,k) => s + PRICES[k], 0);
    const totals = $('[data-bts8-drawer-totals]');
    if (keys.length === 4) {
      totals.innerHTML =
        '<div class="bts8-total"><span>'+t('listValue')+'</span><s>'+tok(ROUTINE.list)+'</s></div>'+
        '<div class="bts8-total bts8-total--save"><span>'+t('youSave')+'</span><b>'+tok(ROUTINE.save)+' · <bdi dir="ltr">'+ROUTINE.pct+'%</bdi></b></div>'+
        '<div class="bts8-total bts8-total--big"><span>'+t('routinePrice')+'</span><b>'+tok(ROUTINE.price)+'</b></div>';
    } else {
      const missing = 4 - keys.length;
      totals.innerHTML =
        (keys.length ? '<div class="bts8-total bts8-total--big"><span>'+t('subtotal')+'</span><b>'+tok(list)+'</b></div>' : '')+
        '<button type="button" class="bts8-drawer__complete" data-bts8-complete><span class="bts8-btn__label">'+
          (keys.length ? t('complete') : t('fullRoutine'))+' · '+tok(ROUTINE.price)+' · '+t('save')+' '+tok(ROUTINE.save)+'</span></button>'+
        (keys.length ? '<p class="bts8-drawer__hint">'+t('completeHint')(missing)+'</p>' : '');
    }
  }

  function openDrawer(trigger) {
    previousFocus = trigger || document.activeElement;
    buildDrawer();
    drawer.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    updateSticky();
    $('.bts8-drawer__head [data-bts8-close]', drawer)?.focus();
  }

  function closeDrawer() {
    drawer.hidden = true;
    document.documentElement.style.overflow = '';
    previousFocus?.focus?.({preventScroll:true});
    previousFocus = null;
    updateSticky();
  }

  function buyRoutine(trigger) {
    ORDER.forEach(k => selected.add(k));
    renderProduct(); renderCount();
    openDrawer(trigger);
  }

  $$('[data-bts8-buy-routine]').forEach(btn => btn.addEventListener('click', () => buyRoutine(btn)));
  $$('[data-bts8-open-drawer]').forEach(btn => btn.addEventListener('click', () => openDrawer(btn)));
  $$('[data-bts8-close]').forEach(btn => btn.addEventListener('click', closeDrawer));
  drawer.addEventListener('click', e => {
    const rm = e.target.closest('[data-bts8-remove]');
    if (rm) {
      selected.delete(rm.dataset.bts8Remove);
      renderProduct(); renderCount(); buildDrawer();
      $('.bts8-drawer__head [data-bts8-close]', drawer)?.focus();
      return;
    }
    if (e.target.closest('[data-bts8-complete]')) {
      ORDER.forEach(k => selected.add(k));
      renderProduct(); renderCount(); buildDrawer();
      $('.bts8-drawer__head [data-bts8-close]', drawer)?.focus();
    }
  });

  /* Detail sheet */
  const sheet = $('[data-bts8-sheet]');
  let sheetPrevious = null;
  function openSheet() {
    const p = PRODUCTS[activeProduct];
    sheetPrevious = document.activeElement;
    $('[data-bts8-sheet-step]').textContent = p.step[language];
    $('[data-bts8-sheet-title]').textContent = p.name;
    $('[data-bts8-sheet-visual]').dataset.key = activeProduct;
    const img = $('[data-bts8-sheet-image]'); img.src = p.image; img.alt = p.name;
    $('[data-bts8-sheet-copy]').textContent = p.detail[language];
    $('[data-bts8-inci]').textContent = p.inci;
    $('[data-bts8-inci]').hidden = true;
    $('[data-bts8-inci-toggle]').setAttribute('aria-expanded','false');
    $('[data-bts8-inci-toggle]').lastElementChild.textContent = '+';
    sheet.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    updateSticky();
    $('.bts8-drawer__head [data-bts8-sheet-close]', sheet)?.focus();
  }
  function closeSheet() {
    sheet.hidden = true;
    document.documentElement.style.overflow = '';
    sheetPrevious?.focus?.({preventScroll:true}); sheetPrevious = null;
    updateSticky();
  }
  $('[data-bts8-detail]').addEventListener('click', openSheet);
  $$('[data-bts8-sheet-close]').forEach(btn => btn.addEventListener('click', closeSheet));
  $('[data-bts8-inci-toggle]').addEventListener('click', e => {
    const content = $('[data-bts8-inci]');
    content.hidden = !content.hidden;
    e.currentTarget.setAttribute('aria-expanded', content.hidden ? 'false' : 'true');
    e.currentTarget.lastElementChild.textContent = content.hidden ? '+' : '−';
  });

  function trap(container, e, closeFn) {
    if (e.key === 'Escape') { closeFn(); return; }
    if (e.key !== 'Tab') return;
    const els = $$('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])', container).filter(x => x.offsetParent !== null);
    if (!els.length) return;
    const first = els[0], last = els[els.length-1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', e => {
    if (!drawer.hidden) { trap(drawer, e, closeDrawer); return; }
    if (!sheet.hidden) trap(sheet, e, closeSheet);
  });

  /* Sticky: one CTA, only when no in-flow routine CTA is on screen and never over the end/footer */
  const sticky = $('[data-bts8-sticky]');
  const hero = $('[data-bts8-hero]');
  const end = $('.bts8-end');
  const inflow = new Set();
  let endVisible = false;
  function updateSticky() {
    const past = hero.getBoundingClientRect().bottom < 80;
    const show = past && !inflow.size && !endVisible && drawer.hidden && sheet.hidden;
    sticky.classList.toggle('is-visible', show);
    sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    sticky.querySelector('button').tabIndex = show ? 0 : -1;
    root.classList.toggle('has-sticky', show);
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.target === end) endVisible = en.isIntersecting;
        else if (en.isIntersecting) inflow.add(en.target); else inflow.delete(en.target);
      });
      updateSticky();
    });
    $$('[data-bts8-inflow-cta]').forEach(el => io.observe(el));
    io.observe(end);
  }
  addEventListener('scroll', updateSticky, {passive:true});
  addEventListener('resize', updateSticky);

  setLanguage('en');
  updateSticky();
})();

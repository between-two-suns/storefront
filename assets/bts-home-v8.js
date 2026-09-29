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

  const COPY = {
    en: {
      navProducts:'Products', navRoutine:'Routine', bag:'Bag', positioning:'Climate-adapted skincare',
      heroTitle:'fresh skin. always.', heroBody:'Four essentials. One clear routine.',
      shopRoutine:'Shop the routine', shopProducts:'Shop individually',
      meetKicker:'THE FOUR', meetTitle:'Everything you need. Nothing extra.',
      whyTitle:'Why it works', whySub:'The formula, in plain language.',
      inRoutine:'In routine', addRoutine:'Add to routine', details:'Full details',
      routineKicker:'YOUR ROUTINE', routineTitle:'Simple enough to keep doing.',
      routineBody:'Four steps in the morning. Three at night.', am:'AM', pm:'PM',
      cleanse:'CLEANSE', treat:'TREAT', hydrate:'HYDRATE', protect:'PROTECT',
      fullRoutine:'THE FULL ROUTINE', reviewRoutine:'Review routine',
      climateKicker:'CLIMATE-ADAPTED, WITHOUT THE COMPLICATED ROUTINE',
      climateTitle:'Made for real days.',
      climateBody:'Heat outside. Air-conditioning inside. Oil, humidity, sun and the rest of the day. The formulas are designed to stay easy to use through changing conditions.',
      endLine:'fresh skin. always.', stickyRoutine:'Full routine · 4 steps',
      drawerKicker:'YOUR ROUTINE',
      drawerNote:'Final pricing and checkout will activate when the launch product records are approved.',
      checkoutDisabled:'Add routine to bag', fullInci:'Full ingredient list'
    },
    ar: {
      navProducts:'المنتجات', navRoutine:'الروتين', bag:'الشنطة', positioning:'عناية بالبشرة متكيفة مع المناخ',
      heroTitle:'بشرة منتعشة. دايمًا.', heroBody:'٤ أساسيات. روتين واضح وبسيط.',
      shopRoutine:'اشتري الروتين كامل', shopProducts:'شوف المنتجات',
      meetKicker:'الأربع خطوات', meetTitle:'كل اللي محتاجاه. من غير تعقيد.',
      whyTitle:'ليه التركيبة دي؟', whySub:'المكونات، بطريقة بسيطة وواضحة.',
      inRoutine:'في الروتين', addRoutine:'ضيفيه للروتين', details:'كل التفاصيل',
      routineKicker:'روتينك', routineTitle:'روتين بسيط تقدري تكمّلي عليه.',
      routineBody:'٤ خطوات الصبح. ٣ بالليل.', am:'الصبح', pm:'بالليل',
      cleanse:'تنظيف', treat:'عناية', hydrate:'ترطيب', protect:'حماية',
      fullRoutine:'الروتين الكامل', reviewRoutine:'راجعي الروتين',
      climateKicker:'عناية متكيفة مع المناخ، من غير روتين معقد',
      climateTitle:'معمولة لليوم الحقيقي.',
      climateBody:'حر بره. تكييف جوه. دهون، رطوبة، شمس وباقي تفاصيل اليوم. التركيبات معمولة عشان تفضل سهلة ومريحة مع تغيّر الظروف.',
      endLine:'بشرة منتعشة. دايمًا.', stickyRoutine:'الروتين كامل · ٤ خطوات',
      drawerKicker:'روتينك',
      drawerNote:'الأسعار النهائية والدفع هيتفعّلوا بعد اعتماد بيانات المنتجات الخاصة بالإطلاق.',
      checkoutDisabled:'ضيفي الروتين للشنطة', fullInci:'قائمة المكونات كاملة'
    }
  };

  const selected = new Set(['reset','clarity','barrier','defense']);
  let language = 'en';
  let activeProduct = 'reset';
  let routineTime = 'am';

  const $ = (s, scope=root) => scope.querySelector(s);
  const $$ = (s, scope=root) => [...scope.querySelectorAll(s)];

  function renderI18n() {
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (COPY[language][key] != null) el.textContent = COPY[language][key];
    });
  }

  function renderProduct() {
    const p = PRODUCTS[activeProduct];
    $('[data-bts8-stage]').dataset.selected = activeProduct;
    $$('[data-bts8-select]').forEach(btn => {
      const on = btn.dataset.bts8Select === activeProduct;
      btn.classList.toggle('is-selected', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $('[data-bts8-step]').textContent = p.step[language];
    $('[data-bts8-name]').textContent = p.name;
    $('[data-bts8-size]').textContent = p.size;
    $('[data-bts8-benefit]').textContent = p.benefit[language];
    $('[data-bts8-claims]').innerHTML = p.claims[language].map(x => '<span>'+x+'</span>').join('');
    $('[data-bts8-formula]').innerHTML = p.formula[language].map(row =>
      '<div class="bts8-formulaitem"><strong>'+row[0]+'</strong><p>'+row[1]+'</p></div>'
    ).join('');
    const toggle = $('[data-bts8-toggle-selected]');
    toggle.dataset.bts8ToggleSelected = activeProduct;
    toggle.setAttribute('aria-pressed', selected.has(activeProduct) ? 'true' : 'false');
    toggle.innerHTML = selected.has(activeProduct)
      ? '<span>'+COPY[language].inRoutine+'</span><span aria-hidden="true">✓</span>'
      : '<span>'+COPY[language].addRoutine+'</span><span aria-hidden="true">+</span>';
  }

  function renderRoutine() {
    const routine = $('[data-bts8-routine]');
    routine.dataset.time = routineTime;
    $$('[data-bts8-time]').forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.bts8Time === routineTime ? 'true' : 'false'));
    $('[data-bts8-routine-label]').textContent = routineTime === 'am'
      ? (language === 'en' ? 'AM · 4 STEPS' : 'الصبح · ٤ خطوات')
      : (language === 'en' ? 'PM · 3 STEPS' : 'بالليل · ٣ خطوات');
    $('[data-bts8-routine-copy]').textContent = routineTime === 'am'
      ? (language === 'en' ? 'Cleanse. Treat. Hydrate. Protect.' : 'تنظيف. عناية. ترطيب. حماية.')
      : (language === 'en' ? 'Cleanse. Treat. Hydrate.' : 'تنظيف. عناية. ترطيب.');
  }

  function visibleRoutineKeys() {
    const base = routineTime === 'pm' ? ['reset','clarity','barrier'] : ['reset','clarity','barrier','defense'];
    return base.filter(k => selected.has(k));
  }

  function renderCount() {
    $('[data-bts8-count]').textContent = String(selected.size);
  }

  function setLanguage(next) {
    language = next;
    root.dataset.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    $('[data-bts8-lang]').textContent = language === 'ar' ? 'EN' : 'AR';
    renderI18n();
    renderProduct();
    renderRoutine();
    renderCount();
  }

  $$('[data-bts8-select]').forEach(btn => btn.addEventListener('click', () => {
    activeProduct = btn.dataset.bts8Select;
    renderProduct();
  }));

  $$('[data-bts8-pick]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeProduct = btn.dataset.bts8Pick;
      $('#products').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
      setTimeout(renderProduct, 150);
    });
    const stop = () => {
      btn.classList.remove('is-pressing');
      btn.style.removeProperty('--pick-x');
      btn.style.removeProperty('--pick-y');
      btn.style.removeProperty('--pick-r');
    };
    btn.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      btn.setPointerCapture?.(e.pointerId);
      btn.dataset.startX = e.clientX;
      btn.dataset.startY = e.clientY;
      btn.classList.add('is-pressing');
    });
    btn.addEventListener('pointermove', e => {
      if (!btn.classList.contains('is-pressing')) return;
      const dx = Math.max(-10, Math.min(10, e.clientX - Number(btn.dataset.startX || e.clientX)));
      const dy = Math.max(-5, Math.min(5, e.clientY - Number(btn.dataset.startY || e.clientY)));
      btn.style.setProperty('--pick-x', dx+'px');
      btn.style.setProperty('--pick-y', dy+'px');
      btn.style.setProperty('--pick-r', (dx*.08)+'deg');
    });
    btn.addEventListener('pointerup', stop);
    btn.addEventListener('pointercancel', stop);
    btn.addEventListener('lostpointercapture', stop);
  });

  $('[data-bts8-toggle-selected]').addEventListener('click', e => {
    const key = e.currentTarget.dataset.bts8ToggleSelected;
    if (selected.has(key)) selected.delete(key); else selected.add(key);
    renderProduct();
    renderCount();
  });

  $$('[data-bts8-time]').forEach(btn => btn.addEventListener('click', () => {
    routineTime = btn.dataset.bts8Time;
    renderRoutine();
  }));

  $('[data-bts8-lang]').addEventListener('click', () => setLanguage(language === 'en' ? 'ar' : 'en'));

  const drawer = $('[data-bts8-drawer]');
  let previousFocus = null;

  function buildDrawer() {
    const keys = visibleRoutineKeys();
    $('[data-bts8-drawer-title]').textContent = routineTime === 'am'
      ? (language === 'en' ? 'AM · '+keys.length+' STEPS' : 'الصبح · '+toArabicNumeral(keys.length)+' خطوات')
      : (language === 'en' ? 'PM · '+keys.length+' STEPS' : 'بالليل · '+toArabicNumeral(keys.length)+' خطوات');
    $('[data-bts8-drawer-items]').innerHTML = keys.map((key,i) => {
      const p=PRODUCTS[key];
      const step = language === 'ar' ? toArabicNumeral(i+1) : String(i+1).padStart(2,'0');
      return '<div class="bts8-draweritem"><img src="'+p.image+'" alt=""><div><strong>'+step+' · '+p.name+'</strong><span>'+p.size+'</span></div><b>'+ (language === 'en' ? 'SELECTED' : 'مُختار') +'</b></div>';
    }).join('');
  }

  function openDrawer(trigger) {
    previousFocus = trigger || document.activeElement;
    buildDrawer();
    drawer.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    $('[data-bts8-sticky]').classList.remove('is-visible');
    $('[data-bts8-close]',drawer)?.focus();
  }

  function closeDrawer() {
    drawer.hidden = true;
    document.documentElement.style.overflow = '';
    previousFocus?.focus?.();
    previousFocus = null;
    updateSticky();
  }

  $$('[data-bts8-open-routine]').forEach(btn => btn.addEventListener('click', () => openDrawer(btn)));
  $$('[data-bts8-close]').forEach(btn => btn.addEventListener('click', closeDrawer));

  const sheet = $('[data-bts8-sheet]');
  let sheetPrevious = null;
  function openSheet() {
    const p=PRODUCTS[activeProduct];
    sheetPrevious = document.activeElement;
    $('[data-bts8-sheet-step]').textContent = p.step[language];
    $('[data-bts8-sheet-title]').textContent = p.name;
    const img=$('[data-bts8-sheet-image]'); img.src=p.image; img.alt=p.name;
    $('[data-bts8-sheet-copy]').textContent = p.detail[language];
    $('[data-bts8-inci]').textContent = p.inci;
    $('[data-bts8-inci]').hidden = true;
    $('[data-bts8-inci-toggle]').setAttribute('aria-expanded','false');
    $('[data-bts8-inci-toggle]').lastElementChild.textContent = '+';
    sheet.hidden=false;
    document.documentElement.style.overflow='hidden';
    $('[data-bts8-sheet-close]',sheet)?.focus();
  }
  function closeSheet() {
    sheet.hidden=true;
    document.documentElement.style.overflow='';
    sheetPrevious?.focus?.(); sheetPrevious=null;
  }
  $('[data-bts8-detail]').addEventListener('click',openSheet);
  $$('[data-bts8-sheet-close]').forEach(btn=>btn.addEventListener('click',closeSheet));
  $('[data-bts8-inci-toggle]').addEventListener('click',e=>{
    const content=$('[data-bts8-inci]');
    content.hidden=!content.hidden;
    e.currentTarget.setAttribute('aria-expanded',content.hidden?'false':'true');
    e.currentTarget.lastElementChild.textContent=content.hidden?'+':'−';
  });

  function trap(container,e,closeFn){
    if(e.key==='Escape'){closeFn();return;}
    if(e.key!=='Tab')return;
    const els=$$('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])',container).filter(x=>x.offsetParent!==null);
    if(!els.length)return;
    const first=els[0],last=els[els.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
  document.addEventListener('keydown',e=>{
    if(!drawer.hidden){trap(drawer,e,closeDrawer);return;}
    if(!sheet.hidden){trap(sheet,e,closeSheet);}
  });

  function toArabicNumeral(n){
    return String(n).replace(/[0-9]/g,d=>'٠١٢٣٤٥٦٧٨٩'[Number(d)]);
  }

  const sticky=$('[data-bts8-sticky]');
  const hero=$('[data-bts8-hero]');
  function updateSticky(){
    if(!drawer.hidden||!sheet.hidden){sticky.classList.remove('is-visible');return;}
    const r=hero.getBoundingClientRect();
    sticky.classList.toggle('is-visible',r.bottom<120);
  }
  addEventListener('scroll',updateSticky,{passive:true});
  addEventListener('resize',updateSticky);

  setLanguage('en');
  updateSticky();
})();
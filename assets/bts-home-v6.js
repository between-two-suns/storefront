(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(v,a=0,b=1)=>Math.min(Math.max(v,a),b);
  const lerp=(a,b,t)=>a+(b-a)*t;

  function init(){
    const root=document.querySelector('[data-bts6]');
    if(!root||root.dataset.ready==='true')return;
    root.dataset.ready='true';

    const header=document.querySelector('[data-bts-header]');
    const progress=root.querySelector('[data-bts6-page-progress]');
    const updatePage=()=>{
      const max=Math.max(document.documentElement.scrollHeight-innerHeight,1);
      const p=clamp(scrollY/max);
      if(progress)progress.style.transform=`scaleX(${p})`;
      header?.classList.toggle('is-scrolled',scrollY>20);
    };
    updatePage();addEventListener('scroll',updatePage,{passive:true});addEventListener('resize',updatePage);

    const hero=root.querySelector('[data-bts6-hero]');
    const heroStage=hero?.querySelector('.bts6-hero-stage');
    const envButtons=[...(hero?.querySelectorAll('[data-env]')||[])];
    const envIndex=hero?.querySelector('[data-bts6-env-index]');
    const envTitle=hero?.querySelector('[data-bts6-env-title]');
    const envCopy=hero?.querySelector('[data-bts6-env-copy]');

    const setEnv=(btn)=>{
      if(!heroStage||!btn)return;
      heroStage.dataset.environment=btn.dataset.env;
      envButtons.forEach(x=>x.setAttribute('aria-pressed',x===btn?'true':'false'));
      if(envIndex)envIndex.textContent=btn.dataset.index;
      if(envTitle)envTitle.textContent=btn.dataset.title;
      if(envCopy)envCopy.textContent=btn.dataset.copy;
    };
    envButtons.forEach((btn,i)=>btn.addEventListener('click',()=>{
      setEnv(btn);
      if(reduce||!hero)return;
      const travel=Math.max(hero.offsetHeight-innerHeight,1);
      const top=scrollY+hero.getBoundingClientRect().top;
      const target=.57+((i+.45)/envButtons.length)*.40;
      scrollTo({top:top+travel*target,behavior:'smooth'});
    }));

    if(hero&&heroStage&&!reduce){
      let ticking=false;
      const updateHero=()=>{
        const r=hero.getBoundingClientRect();
        const travel=Math.max(hero.offsetHeight-innerHeight,1);
        const p=clamp(-r.top/travel);
        const compress=clamp(p/.21);
        const open=clamp((p-.20)/.29);
        const heroOpacity=1-clamp((p-.13)/.18);
        const betweenOpacity=clamp((p-.30)/.17);
        const tabsOpacity=clamp((p-.48)/.12);
        heroStage.style.setProperty('--hero-progress',p.toFixed(4));
        heroStage.style.setProperty('--hero-compress',compress.toFixed(4));
        heroStage.style.setProperty('--hero-open',open.toFixed(4));
        heroStage.style.setProperty('--hero-opacity',heroOpacity.toFixed(4));
        heroStage.style.setProperty('--between-opacity',betweenOpacity.toFixed(4));
        heroStage.style.setProperty('--env-tabs-opacity',tabsOpacity.toFixed(4));
        heroStage.style.setProperty('--hero-pointer',heroOpacity>.55?'auto':'none');
        heroStage.style.setProperty('--between-pointer',betweenOpacity>.55?'auto':'none');
        heroStage.style.setProperty('--env-tabs-pointer',tabsOpacity>.55?'auto':'none');
        if(p<.55){
          heroStage.dataset.environment='base';
        }else if(envButtons.length){
          const ep=clamp((p-.55)/.45);
          const idx=Math.min(envButtons.length-1,Math.floor(ep*envButtons.length));
          setEnv(envButtons[idx]);
        }
        ticking=false;
      };
      const req=()=>{if(ticking)return;ticking=true;requestAnimationFrame(updateHero)};
      updateHero();addEventListener('scroll',req,{passive:true});addEventListener('resize',req);
    }

    const productJourney=root.querySelector('[data-bts6-products]');
    const panels=[...(productJourney?.querySelectorAll('[data-product-panel]')||[])];
    const markers=[...(productJourney?.querySelectorAll('[data-step-marker]')||[])];
    if(productJourney&&panels.length){
      let last=-1,ticking=false;
      const activate=(idx)=>{
        if(idx===last)return;last=idx;
        panels.forEach((panel,i)=>panel.classList.toggle('is-active',i===idx));
        markers.forEach((marker,i)=>marker.classList.toggle('is-active',i===idx));
        const sku=getComputedStyle(panels[idx]).getPropertyValue('--sku').trim();
        productJourney.querySelector('.bts6-product-stage')?.style.setProperty('--active-sku',sku||'#4CB383');
      };
      const updateProducts=()=>{
        const r=productJourney.getBoundingClientRect();
        const travel=Math.max(productJourney.offsetHeight-innerHeight,1);
        const p=clamp(-r.top/travel);
        const raw=p*panels.length;
        const idx=Math.min(panels.length-1,Math.floor(raw));
        activate(idx);
        const local=raw-idx;
        const panel=panels[idx];
        panel?.style.setProperty('--local',local.toFixed(4));
        ticking=false;
      };
      const req=()=>{if(ticking)return;ticking=true;requestAnimationFrame(updateProducts)};
      activate(0);updateProducts();
      if(!reduce){addEventListener('scroll',req,{passive:true});addEventListener('resize',req)}
    }

    root.querySelectorAll('[data-demo-add]').forEach(btn=>btn.addEventListener('click',()=>{
      const label=btn.dataset.demoAdd;
      const old=btn.innerHTML;
      btn.innerHTML='ADDED ✓';
      btn.setAttribute('aria-label',`${label} added to routine preview`);
      setTimeout(()=>{btn.innerHTML=old},900);
    }));

    const routine=root.querySelector('[data-bts6-routine]');
    if(routine){
      const timeButtons=[...routine.querySelectorAll('[data-routine-time]')];
      const count=routine.querySelector('[data-routine-count]');
      timeButtons.forEach(btn=>btn.addEventListener('click',()=>{
        const t=btn.dataset.routineTime;
        routine.dataset.time=t;
        timeButtons.forEach(x=>x.setAttribute('aria-pressed',x===btn?'true':'false'));
        if(count)count.textContent=t==='pm'?'3 STEPS · PM':'4 STEPS · AM';
      }));
      const add=routine.querySelector('[data-routine-add]');
      add?.addEventListener('click',()=>{
        const old=add.innerHTML;
        add.innerHTML='ROUTINE READY ✓';
        setTimeout(()=>add.innerHTML=old,1100);
      });
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  document.addEventListener('shopify:section:load',()=>{document.querySelector('[data-bts6]')?.removeAttribute('data-ready');init()});
})();
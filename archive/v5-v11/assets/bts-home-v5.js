(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(v,a=0,b=1)=>Math.min(Math.max(v,a),b);

  const init=()=>{
    document.querySelectorAll('[data-bts5]').forEach(root=>{
      const hero=root.querySelector('[data-bts5-hero]');
      const stage=hero?.querySelector('.bts5-hero-stage');
      const envButtons=[...(stage?.querySelectorAll('[data-env]')||[])];
      const envIndex=stage?.querySelector('[data-bts5-env-index]');
      const envTitle=stage?.querySelector('[data-bts5-env-title]');
      const envCopy=stage?.querySelector('[data-bts5-env-copy]');

      const setEnv=(btn)=>{
        if(!stage||!btn)return;
        stage.dataset.env=btn.dataset.env;
        envButtons.forEach(x=>x.setAttribute('aria-pressed',x===btn?'true':'false'));
        if(envIndex)envIndex.textContent=btn.dataset.index;
        if(envTitle)envTitle.textContent=btn.dataset.title;
        if(envCopy)envCopy.textContent=btn.dataset.copy;
      };

      envButtons.forEach(btn=>btn.addEventListener('click',()=>setEnv(btn)));

      if(hero&&stage&&!reduce){
        let ticking=false;
        const update=()=>{
          const r=hero.getBoundingClientRect();
          const travel=Math.max(hero.offsetHeight-innerHeight,1);
          const p=clamp(-r.top/travel);
          const compress=clamp(p/.23);
          const open=clamp((p-.22)/.26);
          const heroOpacity=1-clamp((p-.16)/.17);
          const betweenOpacity=clamp((p-.30)/.16);
          const navOpacity=clamp((p-.43)/.12);

          stage.style.setProperty('--p',p.toFixed(4));
          stage.style.setProperty('--compress',compress.toFixed(4));
          stage.style.setProperty('--open',open.toFixed(4));
          stage.style.setProperty('--heroOpacity',heroOpacity.toFixed(4));
          stage.style.setProperty('--betweenOpacity',betweenOpacity.toFixed(4));
          stage.style.setProperty('--navOpacity',navOpacity.toFixed(4));
          stage.style.setProperty('--heroPointer',heroOpacity>.55?'auto':'none');
          stage.style.setProperty('--betweenPointer',betweenOpacity>.55?'auto':'none');
          stage.style.setProperty('--navPointer',navOpacity>.55?'auto':'none');

          if(p<.48){
            stage.dataset.env='base';
          }else if(envButtons.length){
            const ep=clamp((p-.48)/.52);
            const idx=Math.min(envButtons.length-1,Math.floor(ep*envButtons.length));
            setEnv(envButtons[idx]);
          }
          ticking=false;
        };
        const req=()=>{if(ticking)return;ticking=true;requestAnimationFrame(update)};
        update();addEventListener('scroll',req,{passive:true});addEventListener('resize',req);
      }

      const observer=new IntersectionObserver(entries=>{
        entries.forEach(e=>e.target.classList.toggle('is-visible',e.isIntersecting));
      },{threshold:.32});
      root.querySelectorAll('[data-bts5-reveal]').forEach(el=>observer.observe(el));

      const routine=root.querySelector('[data-bts5-routine]');
      if(routine){
        const buttons=[...routine.querySelectorAll('[data-bts5-time]')];
        const count=routine.querySelector('[data-bts5-count]');
        buttons.forEach(btn=>btn.addEventListener('click',()=>{
          const t=btn.dataset.bts5Time;
          routine.dataset.time=t;
          buttons.forEach(x=>x.setAttribute('aria-pressed',x===btn?'true':'false'));
          if(count)count.textContent=t==='pm'?'3 STEPS · PM':'4 STEPS · AM';
        }));
        const add=routine.querySelector('[data-bts5-add]');
        add?.addEventListener('click',()=>{
          const old=add.innerHTML;
          add.textContent='ROUTINE PREVIEW ✓';
          setTimeout(()=>add.innerHTML=old,1000);
        });
      }
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  document.addEventListener('shopify:section:load',init);
})();
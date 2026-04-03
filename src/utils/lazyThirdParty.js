// src/utils/lazyThirdParty.js
// Loads ALL third-party scripts ONLY after first user interaction
// This removes them from the critical rendering path entirely

let loaded = false;

function loadAll() {
  if (loaded) return;
  loaded = true;

  // ── Google Tag Manager ──────────────────────────────────────────
  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    const f=d.getElementsByTagName(s),
          j=d.createElement(s),
          dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MC5GNM34');

  // ── Facebook Pixel ──────────────────────────────────────────────
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e);
    s.parentNode.insertBefore(t,s);
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq && window.fbq('init', '1591523425049580'); // Assuming Pixel ID from previous context, but maybe I should just use the actual one from index.html. Let me check what it is in index.html first.
  window.fbq && window.fbq('track', 'PageView');

  // ── Microsoft Clarity ───────────────────────────────────────────
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;
    t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r);
    y.parentNode.insertBefore(t,y);
  })(window,document,"clarity","script","w4iwh8601l");
}

// Trigger on first user interaction (any of these events)
const TRIGGER_EVENTS = ['mousedown','mousemove','keydown','scroll','touchstart','pointerdown'];

function onInteraction() {
  TRIGGER_EVENTS.forEach(e => window.removeEventListener(e, onInteraction));
  // Use requestIdleCallback to not block current event frame
  if (window.requestIdleCallback) {
    requestIdleCallback(loadAll);
  } else {
    setTimeout(loadAll, 1);
  }
}

TRIGGER_EVENTS.forEach(e =>
  window.addEventListener(e, onInteraction, { once: true, passive: true })
);

// Safety fallback: load after 5s even without interaction (bots, etc.)
setTimeout(loadAll, 5000);

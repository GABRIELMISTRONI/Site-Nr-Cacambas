
'use strict';
(function initCursor() {
 if (window.matchMedia('(max-width:768px)').matches) return;
 if (window.matchMedia('(pointer:coarse)').matches) return;
 var dot  = document.getElementById('cursor-dot');
 var ring = document.getElementById('cursor-ring');
 if (!dot || !ring) return;

 var mx = 0, my = 0, rx = 0, ry = 0;
 var rafId = null, visible = false;
 var ringHalf = 18;

 function moveDot(x, y) {
   dot.style.transform  = 'translate(' + (x - 4) + 'px,' + (y - 4) + 'px)';
 }
 function moveRing(x, y) {
   ring.style.transform = 'translate(' + (x - ringHalf) + 'px,' + (y - ringHalf) + 'px)';
 }

 document.addEventListener('mousemove', function(e) {
   mx = e.clientX; my = e.clientY;
   moveDot(mx, my);
   if (!visible) {
     visible = true;
     rx = mx; ry = my;
     moveRing(rx, ry);
     dot.style.opacity  = '1';
     ring.style.opacity = '1';
   }
   if (!rafId) rafId = requestAnimationFrame(tick);
 }, { passive: true });

 function tick() {
   rafId = null;
   rx += (mx - rx) * 0.13;
   ry += (my - ry) * 0.13;
   moveRing(rx, ry);
   if (Math.abs(mx - rx) > 0.3 || Math.abs(my - ry) > 0.3)
     rafId = requestAnimationFrame(tick);
 }

 function attachHover() {
   var els = document.querySelectorAll('a,button,[role="button"],.service-card,.cacamba-card,.step-card,.depoimento-card,.gallery-item,.faq-q,.cidade-item');
   els.forEach(function(el) {
     el.addEventListener('mouseenter', function() {
       ring.classList.add('is-hovering');
       dot.style.opacity = '0';
     }, { passive: true });
     el.addEventListener('mouseleave', function() {
       ring.classList.remove('is-hovering');
       dot.style.opacity = visible ? '1' : '0';
     }, { passive: true });
   });
 }

 if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', attachHover);
 } else {
   attachHover();
 }

 document.addEventListener('mouseleave', function() {
   dot.style.opacity = '0'; ring.style.opacity = '0';
 });
 document.addEventListener('mouseenter', function() {
   if (visible) { dot.style.opacity = '1'; ring.style.opacity = '1'; }
 });
})();
(function initNav() {
 var nav = document.getElementById('nav');
 var burger = document.getElementById('nav-burger');
 var links = document.querySelector('.nav-links');
 window.addEventListener('scroll', function() {
 nav.classList.toggle('scrolled', window.scrollY > 60);
 }, { passive: true });
 burger.addEventListener('click', function() {
 var isOpen = links.classList.contains('open');
 if (isOpen) {
 links.classList.add('nav-closing');
 setTimeout(function() {
 links.classList.remove('open');
 links.classList.remove('nav-closing');
 }, 320);
 } else {
 links.classList.add('open');
 }
 burger.classList.toggle('open');
 });
 links.querySelectorAll('a').forEach(function(a) {
 a.addEventListener('click', function() {
 burger.classList.remove('open');
 links.classList.add('nav-closing');
 setTimeout(function() {
 links.classList.remove('open');
 links.classList.remove('nav-closing');
 }, 320);
 });
 });
})();
(function initParticles() {
 var canvas = document.getElementById('particles-canvas');
 if (!canvas) return;
 if (window.matchMedia('(max-width:768px)').matches) return;
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 var ctx = canvas.getContext('2d');
 var W, H, particles = [];
 var BRAND = [255, 196, 0];
 var mouse = { x: -999, y: -999 };
 var REPEL_RADIUS = 110, REPEL_FORCE = 2.8;
 function resize() {
 W = canvas.width = canvas.offsetWidth;
 H = canvas.height = canvas.offsetHeight;
 }
 resize();
 window.addEventListener('resize', resize, { passive: true });
 canvas.addEventListener('mousemove', function(e) {
 var rect = canvas.getBoundingClientRect();
 mouse.x = e.clientX - rect.left;
 mouse.y = e.clientY - rect.top;
 });
 canvas.addEventListener('mouseleave', function() { mouse.x = -999; mouse.y = -999; });
 var isMobile = window.matchMedia('(max-width:768px)').matches;
 var total = isMobile ? 14 : 32;
 for (var i = 0; i < total; i++) {
 particles.push({
 x: Math.random() * 1200,
 y: Math.random() * 700,
 ox: 0, oy: 0, 
 vx: (Math.random() - .5) * .38,
 vy: (Math.random() - .5) * .38,
 r: Math.random() * 1.1 + .3,
 a: Math.random() * .15 + .04,
 });
 }
 function draw() {
 ctx.clearRect(0, 0, W, H);
 particles.forEach(function(p) {
 var dx = p.x - mouse.x;
 var dy = p.y - mouse.y;
 var dist = Math.sqrt(dx * dx + dy * dy);
 if (dist < REPEL_RADIUS && dist > 0.1) {
 var force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
 p.vx += (dx / dist) * force * REPEL_FORCE * 0.04;
 p.vy += (dy / dist) * force * REPEL_FORCE * 0.04;
 }
 p.vx *= 0.97;
 p.vy *= 0.97;
 var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
 if (speed < 0.12) {
 p.vx += (Math.random() - .5) * 0.06;
 p.vy += (Math.random() - .5) * 0.06;
 }
 p.x += p.vx; p.y += p.vy;
 if (p.x < 0) p.x = W;
 if (p.x > W) p.x = 0;
 if (p.y < 0) p.y = H;
 if (p.y > H) p.y = 0;
 ctx.beginPath();
 ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
 ctx.fillStyle = 'rgba(' + BRAND[0] + ',' + BRAND[1] + ',' + BRAND[2] + ',' + p.a + ')';
 ctx.fill();
 });
 for (var i = 0; i < particles.length; i++) {
 for (var j = i + 1; j < particles.length; j++) {
 var dx = particles[i].x - particles[j].x;
 var dy = particles[i].y - particles[j].y;
 var d = Math.sqrt(dx * dx + dy * dy);
 if (d < 130) {
 ctx.beginPath();
 ctx.moveTo(particles[i].x, particles[i].y);
 ctx.lineTo(particles[j].x, particles[j].y);
 ctx.strokeStyle = 'rgba(' + BRAND[0] + ',' + BRAND[1] + ',' + BRAND[2] + ',' + (.04 * (1 - d / 130)) + ')';
 ctx.lineWidth = .75;
 ctx.stroke();
 }
 }
 }
 if (mouse.x > 0) {
 ctx.beginPath();
 ctx.arc(mouse.x, mouse.y, REPEL_RADIUS, 0, Math.PI * 2);
 ctx.strokeStyle = 'rgba(255,196,0,.07)';
 ctx.lineWidth = 1;
 ctx.stroke();
 }
 requestAnimationFrame(draw);
 }
 draw();
})();
(function initReveal() {
 var els = document.querySelectorAll('.reveal-up');
 if (!('IntersectionObserver' in window)) {
 els.forEach(function(el) { el.classList.add('visible'); });
 return;
 }
 var obs = new IntersectionObserver(function(entries) {
 entries.forEach(function(e) {
 if (e.isIntersecting) {
 e.target.classList.add('visible');
 obs.unobserve(e.target);
 }
 });
 }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
 els.forEach(function(el) { obs.observe(el); });
})();
(function initStagger() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
 document.querySelectorAll('.stagger-line').forEach(function(l) { l.classList.add('visible'); });
 return;
 }
 requestAnimationFrame(function() {
 document.querySelectorAll('.stagger-line').forEach(function(line) {
 line.classList.add('visible');
 });
 });
})();
(function initImgReveal() {
 var img = document.querySelector('.hero-img-reveal');
 if (!img) return;
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
 img.classList.add('clip-visible'); return;
 }
 function activate() { img.classList.add('clip-visible'); }
 if (img.complete) { setTimeout(activate, 50); }
 else { img.addEventListener('load', function() { setTimeout(activate, 50); }); }
})();
(function initBadgeBounce() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 var wrap = document.querySelector('.hero-photo-wrap');
 if (!wrap) return;
 var obs = new IntersectionObserver(function(entries) {
 entries.forEach(function(e) {
 if (!e.isIntersecting) return;
 obs.unobserve(e.target);
 wrap.querySelectorAll('.photo-badge-top, .photo-badge-bottom, .photo-float')
 .forEach(function(b) { b.classList.add('badge-bounced'); });
 });
 }, { threshold: .3 });
 obs.observe(wrap);
})();
(function initCounters() {
 var counts = document.querySelectorAll('.count');
 if (!counts.length) return;
 counts.forEach(function(el) {
 el.style.display = 'inline-block';
 });
 function runCounter(el) {
 if (el.getAttribute('data-counted') === '1') return;
 el.setAttribute('data-counted', '1');
 var end = parseInt(el.dataset.target, 10);
 var dur = Math.max(1200, Math.min(2000, end * 18));
 var start = performance.now();
 function tick(now) {
 var progress = Math.min(1, (now - start) / dur);
 var ease = 1 - Math.pow(1 - progress, 3);
 el.textContent = Math.round(ease * end);
 if (progress >= 1) {
 el.textContent = end;
 return;
 }
 requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 }
 if (!('IntersectionObserver' in window)) {
 counts.forEach(function(el) { runCounter(el); });
 return;
 }
 var obs = new IntersectionObserver(function(entries) {
 entries.forEach(function(entry) {
 if (entry.isIntersecting) {
 obs.unobserve(entry.target);
 runCounter(entry.target);
 }
 });
 }, { threshold: 0.3 });
 counts.forEach(function(el) { obs.observe(el); });
})();
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
 a.addEventListener('click', function(e) {
 var target = document.querySelector(a.getAttribute('href'));
 if (!target) return;
 e.preventDefault();
 var top = target.getBoundingClientRect().top + window.scrollY - 80;
 window.scrollTo({ top: top, behavior: 'smooth' });
 });
});
function enviarContato(e) {
 e.preventDefault();
 var form = e.target;
 var btn = form.querySelector('.btn-submit');
 var fields = form.querySelectorAll('input, select');
 var nome = fields[0].value;
 var tel = fields[1].value;
 var tam = fields[2].value;
 var end = fields[3].value;
 btn.disabled = true;
 btn.innerHTML = '<svg style="animation:spin .7s linear infinite;display:inline-block;vertical-align:middle;margin-right:6px" viewBox="0 0 24 24" width="18" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="15" stroke-linecap="round"/></svg>Enviando…';
 if (!document.getElementById('spin-kf')) {
 var sk = document.createElement('style'); sk.id = 'spin-kf';
 sk.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
 document.head.appendChild(sk);
 }
 var msg = '👋 *Olá, NR Caçambas!*\n\n'
 + 'Vim pelo site de vocês e gostaria de solicitar uma caçamba.\n\n'
 + '━━━━━━━━━━━━━━━\n'
 + '👤 *Nome:* ' + nome + '\n'
 + '📞 *Telefone:* ' + tel + '\n'
 + '📦 *Tamanho:* ' + tam + '\n'
 + '📍 *Endereço:* ' + end + '\n'
 + '━━━━━━━━━━━━━━━\n\n'
 + 'Aguardo o contato. Obrigado!';
 setTimeout(function() {
 window.open('https://wa.me/551432324222?text=' + encodeURIComponent(msg), '_blank');
 btn.innerHTML = '<svg style="display:inline-block;vertical-align:middle;margin-right:6px;animation:checkPop .45s cubic-bezier(.34,1.56,.64,1) both" viewBox="0 0 24 24" width="18" fill="none"><path d="m5 12 5 5 9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Enviado!';
 btn.style.background = '#25d366';
 btn.style.color = '#fff';
 btn.style.boxShadow = '0 4px 20px rgba(37,211,102,.4)';
 if (!document.getElementById('check-kf')) {
 var ck = document.createElement('style'); ck.id = 'check-kf';
 ck.textContent = '@keyframes checkPop{0%{transform:scale(0) rotate(-20deg)}70%{transform:scale(1.2)}100%{transform:scale(1)}}';
 document.head.appendChild(ck);
 }
 setTimeout(function() {
 form.reset();
 form.querySelectorAll('.field-valid,.field-invalid').forEach(function(f) {
 f.classList.remove('field-valid','field-invalid');
 });
 form.querySelectorAll('.field-hint').forEach(function(h) { h.textContent = ''; });
 btn.innerHTML = 'Enviar solicitação';
 btn.style.background = '';
 btn.style.color = '';
 btn.style.boxShadow = '';
 btn.disabled = false;
 }, 3200);
 }, 900);
}
(function initParallax() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 if (window.matchMedia('(max-width: 1024px)').matches) return;
 var photo = document.querySelector('.hero-photo-wrap');
 var grid = document.querySelector('.hero-grid');
 var canvas = document.getElementById('particles-canvas');
 var content = document.querySelector('.hero-content');
 var diag = document.querySelector('.hero-diagonal');
 var ticking = false;
 function onScroll() {
 if (ticking) return;
 ticking = true;
 requestAnimationFrame(function() {
 var y = window.scrollY;
 if (y > window.innerHeight * 1.2) { ticking = false; return; }
 if (photo) photo.style.transform = 'translateY(' + (y * 0.10) + 'px)';
 if (grid) grid.style.transform = 'translateY(' + (y * 0.04) + 'px)';
 if (diag) diag.style.transform = 'translateY(' + (y * 0.06) + 'px)';
 if (canvas) canvas.style.transform = 'translateY(' + (y * 0.07) + 'px)';
 if (content) content.style.transform = 'translateY(' + (y * 0.02) + 'px)';
 ticking = false;
 });
 }
 window.addEventListener('scroll', onScroll, { passive: true });
})();
(function initCardFlip() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 var cards = document.querySelectorAll('.service-card');
 if (!cards.length) return;
 cards.forEach(function(c) {
 c.classList.remove('reveal-up'); 
 c.classList.add('card-flip-ready');
 });
 var obs = new IntersectionObserver(function(entries) {
 entries.forEach(function(e) {
 if (!e.isIntersecting) return;
 var idx = Array.from(cards).indexOf(e.target);
 setTimeout(function() {
 e.target.classList.add('card-flip-visible');
 }, idx * 80);
 obs.unobserve(e.target);
 });
 }, { threshold: .15, rootMargin: '0px 0px -30px 0px' });
 cards.forEach(function(c) { obs.observe(c); });
})();
(function initStepsCascade() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 var stepsSection = document.getElementById('como-funciona');
 if (!stepsSection) return;
 var stepCards = Array.from(stepsSection.querySelectorAll('.step-card'));
 var connectors = Array.from(stepsSection.querySelectorAll('.step-connector'));
 if (!stepCards.length) return;
 stepCards.forEach(function(c) {
 c.classList.remove('reveal-up');
 c.style.opacity = '0';
 c.style.transform = 'translateY(32px) scale(.97)';
 c.style.transition = 'opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1)';
 });
 connectors.forEach(function(c) {
 c.style.opacity = '0';
 var path = c.querySelector('path, line');
 if (path) {
 var len = path.getTotalLength ? path.getTotalLength() : 80;
 path.style.strokeDasharray = len;
 path.style.strokeDashoffset = len;
 path.style.transition = 'stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)';
 }
 });
 var triggered = false;
 var obs = new IntersectionObserver(function(entries) {
 if (!entries[0].isIntersecting || triggered) return;
 triggered = true;
 obs.disconnect();
 var sequence = [];
 stepCards.forEach(function(card, i) {
 sequence.push({ type: 'card', el: card });
 if (connectors[i]) sequence.push({ type: 'conn', el: connectors[i] });
 });
 sequence.forEach(function(item, i) {
 var delay = i * 180;
 setTimeout(function() {
 if (item.type === 'card') {
 item.el.style.opacity = '1';
 item.el.style.transform = 'translateY(0) scale(1)';
 var num = item.el.querySelector('.step-number');
 if (num) {
 num.style.animation = 'stepNumPop .5s cubic-bezier(.34,1.56,.64,1) both';
 }
 } else {
 item.el.style.opacity = '1';
 var path = item.el.querySelector('path, line');
 if (path) path.style.strokeDashoffset = '0';
 }
 }, delay);
 });
 if (!document.getElementById('step-num-kf')) {
 var s = document.createElement('style');
 s.id = 'step-num-kf';
 s.textContent = '@keyframes stepNumPop{0%{transform:scale(0) rotate(-15deg);opacity:0}'
 + '60%{transform:scale(1.2) rotate(4deg)}100%{transform:scale(1) rotate(0);opacity:1}}';
 document.head.appendChild(s);
 }
 }, { threshold: 0.15 });
 obs.observe(stepsSection);
})();
(function initTilt() {
 if (window.matchMedia('(max-width:768px)').matches) return;
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 document.querySelectorAll('.cacamba-card').forEach(function(card) {
 card.addEventListener('mousemove', function(e) {
 var rect = card.getBoundingClientRect();
 var x = (e.clientX - rect.left) / rect.width - .5;
 var y = (e.clientY - rect.top) / rect.height - .5;
 card.style.transform = 'translateY(-6px) rotateX(' + (-y*6) + 'deg) rotateY(' + (x*6) + 'deg)';
 });
 card.addEventListener('mouseleave', function() {
 card.style.transform = '';
 });
 });
})();
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
 if (img.complete) {
 img.classList.add('loaded');
 } else {
 img.addEventListener('load', () => img.classList.add('loaded'));
 }
});
(function initFAQ() {
 document.querySelectorAll('.faq-q').forEach(function(btn) {
 btn.addEventListener('click', function() {
 var item = btn.closest('.faq-item');
 var isOpen = btn.getAttribute('aria-expanded') === 'true';
 document.querySelectorAll('.faq-item').forEach(function(i) {
 i.classList.remove('open');
 i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
 });
 if (!isOpen) {
 item.classList.add('open');
 btn.setAttribute('aria-expanded', 'true');
 setTimeout(function() {
 var rect = item.getBoundingClientRect();
 var navH = 72; 
 var top = rect.top + window.scrollY - navH - 12;
 if (rect.top < navH + 20 || rect.bottom > window.innerHeight - 40) {
 window.scrollTo({ top: top, behavior: 'smooth' });
 }
 }, 60);
 }
 });
 });
})();
(function initTyping() {
 var el = document.querySelector('.hero-typing');
 var cursor = document.querySelector('.typing-cursor');
 if (!el) return;
 var words = ['sua obra.', 'sua reforma.', 'seu terreno.', 'sua empresa.'];
 var longest = words.reduce(function(a, b) { return b.length > a.length ? b : a; }, '');
 el.style.minWidth = (longest.length + 0.5) + 'ch';
 if (cursor) {
 cursor.style.cssText = 'display:inline-block;width:2.5px;height:.85em;background:currentColor;'
 + 'margin-left:2px;vertical-align:text-bottom;border-radius:1px;'
 + 'animation:beamBlink .9s cubic-bezier(.4,0,.6,1) infinite;';
 cursor.textContent = '';
 if (!document.getElementById('beam-kf')) {
 var s = document.createElement('style');
 s.id = 'beam-kf';
 s.textContent = '@keyframes beamBlink{0%,45%{opacity:1}55%,100%{opacity:0}}';
 document.head.appendChild(s);
 }
 }
 var wi = 0, ci = 0, deleting = false;
 function typeSpeed() {
 var pct = ci / words[wi].length;
 if (pct < 0.2) return 105 + Math.random() * 30; 
 if (pct < 0.8) return 42 + Math.random() * 22; 
 return 80 + Math.random() * 20; 
 }
 function delSpeed() { return 26 + Math.random() * 18; }
 function tick() {
 var word = words[wi];
 if (!deleting) {
 ci++;
 el.textContent = word.slice(0, ci);
 if (ci >= word.length) { deleting = true; setTimeout(tick, 2100); return; }
 } else {
 ci--;
 el.textContent = word.slice(0, ci);
 if (ci <= 0) {
 deleting = false;
 wi = (wi + 1) % words.length;
 setTimeout(tick, 300); return;
 }
 }
 setTimeout(tick, deleting ? delSpeed() : typeSpeed());
 }
 setTimeout(tick, 1600);
})();
(function initWppFloat() {
 var wrap = document.getElementById('wpp-wrap');
 var floatBtn = document.getElementById('wpp-float');
 var bubble = document.getElementById('wpp-bubble');
 var closeBtn = document.getElementById('wpp-bubble-close');
 if (!wrap || !floatBtn || !bubble) return;
 var bubbleDismissed = false; 
 var bubbleShown = false; 
 var labelShown = false; 
 window.addEventListener('scroll', function() {
 var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
 if (!labelShown && pct >= 0.50) {
 labelShown = true;
 floatBtn.classList.add('wpp-expanded');
 setTimeout(function() {
 floatBtn.classList.remove('wpp-expanded');
 }, 4000);
 }
 }, { passive: true });
 floatBtn.addEventListener('mouseenter', function() {
 if (bubbleDismissed) return;
 if (bubbleShown) return;
 bubbleShown = true;
 bubble.classList.add('bubble-show');
 });
 closeBtn.addEventListener('click', function(e) {
 e.preventDefault();
 e.stopPropagation();
 bubbleDismissed = true;
 bubble.classList.remove('bubble-show');
 bubble.classList.add('bubble-hide');
 });
 bubble.addEventListener('click', function(e) {
 if (e.target === closeBtn) return;
 window.open('https://wa.me/551432324222?text=' + encodeURIComponent('Olá, NR Caçambas! 👋\nVi o site de vocês e gostaria de solicitar uma caçamba.\nPodem me atender?'), '_blank', 'noopener,noreferrer');
 });
 bubble.style.cursor = 'pointer';
})();
(function initNavActive() {
 var sections = document.querySelectorAll('section[id], div[id]');
 var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
 if (!navLinks.length) return;
 function updateActive() {
 var scrollY = window.scrollY + 100;
 var current = '';
 sections.forEach(function(sec) {
 if (sec.offsetTop <= scrollY) current = sec.getAttribute('id');
 });
 navLinks.forEach(function(a) {
 var href = a.getAttribute('href').replace('#', '');
 a.classList.toggle('nav-active', href === current);
 });
 }
 window.addEventListener('scroll', updateActive, { passive: true });
 updateActive();
})();
(function initBackToTop() {
 var btn = document.getElementById('back-to-top');
 if (!btn) return;
 window.addEventListener('scroll', function() {
 var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
 btn.classList.toggle('btt-visible', pct >= 0.40);
 }, { passive: true });
 btn.addEventListener('click', function() {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 });
})();
(function initInlineValidation() {
 var form = document.getElementById('form-contato');
 if (!form) return;
 function getOrCreateHint(field) {
 var wrap = field.closest('.field');
 var hint = wrap.querySelector('.field-hint');
 if (!hint) {
 hint = document.createElement('div');
 hint.className = 'field-hint';
 wrap.appendChild(hint);
 }
 return hint;
 }
 function validateField(field) {
 var val = field.value.trim();
 var hint = getOrCreateHint(field);
 var valid = false;
 var msg = '';
 if (field.type === 'text' && field.autocomplete === 'name') {
 valid = val.length >= 2;
 msg = valid ? '✓ Nome válido' : val.length ? 'Digite seu nome completo' : '';
 } else if (field.type === 'tel') {
 var digits = val.replace(/\D/g,'');
 valid = digits.length >= 10;
 msg = valid ? '✓ Telefone válido' : val.length ? 'Mínimo 10 dígitos' : '';
 } else if (field.tagName === 'SELECT') {
 valid = !!val;
 msg = valid ? '✓ Selecionado' : '';
 } else if (field.type === 'text') {
 valid = val.length >= 5;
 msg = valid ? '✓ Endereço ok' : val.length ? 'Endereço muito curto' : '';
 }
 if (val.length || field.tagName === 'SELECT') {
 field.classList.toggle('field-valid', valid);
 field.classList.toggle('field-invalid', !valid && val.length > 0);
 hint.textContent = msg;
 hint.className = 'field-hint ' + (valid ? 'hint-ok' : val.length ? 'hint-err' : '');
 }
 }
 form.querySelectorAll('input, select').forEach(function(f) {
 f.addEventListener('input', function() { validateField(f); });
 f.addEventListener('change', function() { validateField(f); });
 f.addEventListener('blur', function() { validateField(f); });
 });
})();
(function initPhoneMask() {
 var telInput = document.querySelector('#form-contato input[type="tel"]');
 if (!telInput) return;
 telInput.addEventListener('input', function() {
 var v = telInput.value.replace(/\D/g, '').slice(0, 11);
 if (v.length === 0) { telInput.value = ''; return; }
 var masked = '';
 if (v.length <= 2) {
 masked = '(' + v;
 } else if (v.length <= 6) {
 masked = '(' + v.slice(0,2) + ') ' + v.slice(2);
 } else if (v.length <= 10) {
 masked = '(' + v.slice(0,2) + ') ' + v.slice(2,6) + '-' + v.slice(6);
 } else {
 masked = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
 }
 telInput.value = masked;
 });
})();
(function initClickRipple() {
 if (window.matchMedia('(max-width:768px)').matches) return;
 document.addEventListener('click', function(e) {
 var r = document.createElement('div');
 r.style.cssText = 'position:fixed;left:'+e.clientX+'px;top:'+e.clientY
 +'px;width:6px;height:6px;border-radius:50%;background:rgba(255,196,0,.7);'
 +'transform:translate(-50%,-50%) scale(1);pointer-events:none;z-index:9997;'
 +'animation:rippleOut .55s var(--ease-out,ease) forwards;';
 document.body.appendChild(r);
 r.addEventListener('animationend', function() { r.remove(); });
 });
 if (!document.querySelector('#ripple-keyframes')) {
 var s = document.createElement('style');
 s.id = 'ripple-keyframes';
 s.textContent = '@keyframes rippleOut{0%{width:6px;height:6px;opacity:1}100%{width:44px;height:44px;opacity:0}}';
 document.head.appendChild(s);
 }
})();
(function initMagneticButtons() {
 if (window.matchMedia('(max-width: 768px)').matches) return;
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 var btns = document.querySelectorAll('.btn-primary, .btn-nav, .wpp-float');
 btns.forEach(function(btn) {
 btn.addEventListener('mousemove', function(e) {
 var rect = btn.getBoundingClientRect();
 var cx = rect.left + rect.width / 2;
 var cy = rect.top + rect.height / 2;
 var dx = (e.clientX - cx) * 0.28;
 var dy = (e.clientY - cy) * 0.28;
 btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.04)';
 btn.style.transition = 'transform .1s ease';
 });
 btn.addEventListener('mouseleave', function() {
 btn.style.transform = '';
 btn.style.transition = 'transform .5s var(--ease-spring, cubic-bezier(.34,1.56,.64,1))';
 });
 });
})();
(function initTickerHover() {
 var ticker = document.querySelector('.ticker');
 if (!ticker) return;
 ticker.parentElement.addEventListener('mouseenter', function() {
 ticker.style.animationPlayState = 'paused';
 ticker.style.opacity = '.75';
 });
 ticker.parentElement.addEventListener('mouseleave', function() {
 ticker.style.animationPlayState = 'running';
 ticker.style.opacity = '1';
 });
})();
(function initCTASplash() {
 if (window.matchMedia('(max-width: 768px)').matches) return;
 var style = document.createElement('style');
 style.textContent = '@keyframes splashRing{0%{transform:translate(-50%,-50%) scale(0);opacity:.7}100%{transform:translate(-50%,-50%) scale(1);opacity:0}}';
 document.head.appendChild(style);
 document.querySelectorAll('.btn-primary, .btn-cacamba').forEach(function(btn) {
 btn.style.position = 'relative';
 btn.style.overflow = 'hidden';
 btn.addEventListener('click', function(e) {
 var rect = btn.getBoundingClientRect();
 var x = e.clientX - rect.left;
 var y = e.clientY - rect.top;
 [40, 70, 100].forEach(function(size, i) {
 var ring = document.createElement('span');
 ring.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;'
 + 'width:' + size + 'px;height:' + size + 'px;border-radius:50%;'
 + 'border:2px solid rgba(255,196,0,' + (.6 - i * .15) + ');'
 + 'pointer-events:none;'
 + 'animation:splashRing ' + (.4 + i * .12) + 's ease-out ' + (i * .07) + 's forwards;';
 btn.appendChild(ring);
 ring.addEventListener('animationend', function() { ring.remove(); });
 });
 });
 });
})();
(function initTitleDepth() {
 var title = document.querySelector('.hero-title');
 if (!title) return;
 if (window.matchMedia('(max-width: 768px)').matches) return;
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 document.addEventListener('mousemove', function(e) {
 var cx = window.innerWidth / 2;
 var cy = window.innerHeight / 2;
 var dx = (e.clientX - cx) / cx; 
 var dy = (e.clientY - cy) / cy;
 var depth = 6;
 var lines = title.querySelectorAll('.title-line:not(.accent-line)');
 lines.forEach(function(line) {
 line.style.textShadow =
 (dx * depth * 0.5) + 'px ' + (dy * depth * 0.5) + 'px 0 rgba(7,59,142,.5),'
 + (dx * depth) + 'px ' + (dy * depth) + 'px 0 rgba(3,26,58,.35),'
 + (dx * depth * 1.5) + 'px ' + (dy * depth * 1.5) + 'px 0 rgba(0,0,0,.15)';
 });
 });
})();
(function initCTAShape() {
 var cta = document.querySelector('.section-cta');
 if (!cta) return;
 cta.style.clipPath = 'polygon(0 3.5%, 100% 0%, 100% 96.5%, 0% 100%)';
 cta.style.margin = '-3rem 0';
 cta.style.padding = 'calc(6rem + 3rem) 0';
 cta.style.position = 'relative';
 cta.style.zIndex = '2';
})();
(function initCacambaMorph() {
 var sel = document.querySelector('#form-contato select');
 if (!sel) return;
 var preview = document.createElement('div');
 preview.id = 'cacamba-preview';
 preview.style.cssText = 'display:flex;align-items:center;justify-content:center;'
 + 'height:70px;margin-top:.6rem;transition:opacity .35s;opacity:0;';
 preview.innerHTML = buildSVG('none');
 sel.closest('.field').appendChild(preview);
 sel.addEventListener('change', function() {
 var v = sel.value;
 if (!v || v.includes('certeza')) { preview.style.opacity = '0'; return; }
 var size = v.includes('3') ? '3' : '4';
 preview.innerHTML = buildSVG(size);
 preview.style.opacity = '1';
 var svg = preview.querySelector('svg');
 svg.style.transform = 'scale(.8) translateY(8px)';
 svg.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1)';
 requestAnimationFrame(function() {
 requestAnimationFrame(function() {
 svg.style.transform = 'scale(1) translateY(0)';
 });
 });
 });
 function buildSVG(size) {
 if (size === 'none') return '';
 var w = size === '3' ? 100 : 130;
 var label = size === '3' ? '3m³' : '4m³';
 return '<svg viewBox="0 0 ' + (w + 40) + ' 90" fill="none" style="height:70px">'
 + '<defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">'
 + '<stop offset="0%" stop-color="#ffd84d"/>'
 + '<stop offset="100%" stop-color="#0b4cab"/>'
 + '</linearGradient></defs>'
 + '<path d="M10 20 L' + (w+30) + ' 20 L' + (w+16) + ' 80 L24 80 Z" fill="url(#mg)"/>'
 + '<path d="M6 20 L' + (w+34) + ' 20 L' + (w+38) + ' 12 L2 12 Z" fill="#ffe071"/>'
 + '<text x="' + ((w+40)/2) + '" y="58" font-family="Bebas Neue,sans-serif" font-size="22" '
 + 'fill="white" opacity=".9" text-anchor="middle" letter-spacing="2">' + label + '</text>'
 + '</svg>';
 }
})();
(function initCacambaSwing() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 if (!document.getElementById('swing-kf')) {
 var s = document.createElement('style'); s.id = 'swing-kf';
 s.textContent = '@keyframes cableSwing{'
 + '0%{transform-origin:top center;transform:rotate(-4deg)}'
 + '25%{transform:rotate(3deg)}'
 + '50%{transform:rotate(-2deg)}'
 + '75%{transform:rotate(1.5deg)}'
 + '100%{transform:rotate(0deg)}'
 + '}';
 document.head.appendChild(s);
 }
 var obs = new IntersectionObserver(function(entries) {
 entries.forEach(function(e) {
 if (!e.isIntersecting) return;
 obs.unobserve(e.target);
 var lines = e.target.querySelectorAll('.cacamba-svg svg line');
 lines.forEach(function(line, i) {
 line.style.transformOrigin = 'top center';
 line.style.animation = 'cableSwing 1.2s cubic-bezier(.36,.07,.19,.97) ' + (i * 120) + 'ms both';
 });
 });
 }, { threshold: 0.4 });
 document.querySelectorAll('.cacamba-card').forEach(function(c) { obs.observe(c); });
})();
(function initBadgeGlow() {
 var badge = document.querySelector('.photo-badge-top');
 if (!badge) return;
 if (!document.getElementById('badge-glow-kf')) {
 var s = document.createElement('style'); s.id = 'badge-glow-kf';
 s.textContent = '@keyframes rotateBadge{to{transform:rotate(360deg)}}'
 + '.badge-ring-glow{position:absolute;inset:-3px;border-radius:999px;'
 + 'background:conic-gradient(rgba(255,196,0,.7) 0deg,transparent 60deg,rgba(255,196,0,.15) 180deg,transparent 240deg,rgba(255,196,0,.5) 300deg,rgba(255,196,0,.7) 360deg);'
 + 'animation:rotateBadge 3s linear infinite;z-index:-1;filter:blur(2px);}';
 document.head.appendChild(s);
 }
 badge.style.position = 'relative';
 var ring = document.createElement('div');
 ring.className = 'badge-ring-glow';
 badge.appendChild(ring);
})();
(function initCTABounce() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 var btn = document.querySelector('.hero-ctas .btn-primary');
 if (!btn) return;
 if (!document.getElementById('bounce-kf')) {
 var s = document.createElement('style'); s.id = 'bounce-kf';
 s.textContent = '@keyframes btnBounce{0%{transform:translateY(0)}'
 + '30%{transform:translateY(-6px)}60%{transform:translateY(2px)}'
 + '80%{transform:translateY(-3px)}100%{transform:translateY(0)}}';
 document.head.appendChild(s);
 }
 var obs = new IntersectionObserver(function(entries) {
 if (!entries[0].isIntersecting) return;
 obs.disconnect();
 setTimeout(function() {
 btn.style.animation = 'btnBounce .7s cubic-bezier(.36,.07,.19,.97) both';
 btn.addEventListener('animationend', function() { btn.style.animation = ''; }, { once: true });
 }, 900); 
 }, { threshold: 1 });
 obs.observe(btn);
})();
(function initFAQFade() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 if (!document.getElementById('faq-fade-kf')) {
 var s = document.createElement('style'); s.id = 'faq-fade-kf';
 s.textContent = '.faq-a p{opacity:0;transform:translateY(6px);transition:opacity .3s .08s,transform .3s .08s}'
 + '.faq-item.open .faq-a p{opacity:1;transform:translateY(0)}';
 document.head.appendChild(s);
 }
})();
(function initRouteLight() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 if (!document.getElementById('route-light-kf')) {
 var s = document.createElement('style'); s.id = 'route-light-kf';
 s.textContent = '@keyframes routeLight{'
 + '0%{stroke-dashoffset:200}100%{stroke-dashoffset:-200}}'
 + '.route-light{stroke-dasharray:40 160;animation:routeLight 2s linear infinite;'
 + 'stroke:rgba(255,196,0,.8);stroke-width:2;stroke-linecap:round;fill:none}';
 document.head.appendChild(s);
 }
 var routeLines = document.querySelectorAll('.route-line');
 routeLines.forEach(function(line) {
 var parent = line.parentNode;
 var light = line.cloneNode(false);
 light.classList.remove('route-line');
 light.classList.add('route-light');
 light.removeAttribute('stroke-dasharray');
 light.style.animationDelay = (Math.random() * 1.5) + 's';
 parent.appendChild(light);
 });
})();
(function initPinShadow() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 if (!document.getElementById('pin-shadow-kf')) {
 var s = document.createElement('style'); s.id = 'pin-shadow-kf';
 s.textContent = '@keyframes pinShadow{'
 + '0%,100%{rx:12;ry:4;opacity:.2}'
 + '50%{rx:8;ry:3;opacity:.35}}'
 + '.pin-shadow-el{animation:pinShadow 2.4s ease-in-out infinite;fill:rgba(0,0,0,.4)}';
 document.head.appendChild(s);
 }
 var pinGroup = document.querySelector('.pin-glow');
 if (!pinGroup) return;
 var svg = pinGroup.closest('svg');
 if (!svg) return;
 var shadow = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
 shadow.setAttribute('cx', pinGroup.getAttribute('cx') || '200');
 shadow.setAttribute('cy', '320');
 shadow.setAttribute('rx', '12');
 shadow.setAttribute('ry', '4');
 shadow.classList.add('pin-shadow-el');
 svg.insertBefore(shadow, svg.firstChild);
})();
(function upgradeCardStagger() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 var cards = Array.from(document.querySelectorAll('.service-card'));
 if (!cards.length) return;
 var obs = new IntersectionObserver(function(entries) {
 entries.forEach(function(e) {
 if (!e.isIntersecting) return;
 obs.unobserve(e.target);
 var idx = cards.indexOf(e.target);
 e.target.style.transitionDelay = (idx * 110) + 'ms';
 });
 }, { threshold: .1 });
 cards.forEach(function(c) { obs.observe(c); });
})();

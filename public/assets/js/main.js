/* Mazhi Sheti — small progressive enhancements */
(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- mobile drawer ---------- */
  var burger = document.querySelector('.nav__burger');
  var drawer = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!burger || !drawer) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.hidden = !open;
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      setMenu(drawer.hidden);
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  /* ---------- animated metric bars ---------- */
  var bars = document.querySelectorAll('.metric__bar i');
  if (bars.length && 'IntersectionObserver' in window) {
    bars.forEach(function (bar) {
      bar.dataset.fill = getComputedStyle(bar).getPropertyValue('--fill').trim() || '0%';
      bar.style.width = '0%';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var bar = entry.target;
        var i = Array.prototype.indexOf.call(bars, bar);
        setTimeout(function () {
          bar.style.transition = 'width 1.1s cubic-bezier(.22,.7,.25,1)';
          bar.style.width = bar.dataset.fill;
        }, 180 + i * 110);
        io.unobserve(bar);
      });
    }, { threshold: 0.35 });
    bars.forEach(function (bar) { io.observe(bar); });
  }

  /* ---------- count the big numbers up ---------- */
  var nums = document.querySelectorAll('.stat__num');
  var counted = false;
  function countUp(el, target, suffix) {
    var start = performance.now();
    var dur = 1400;
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (nums.length && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || counted) return;
        counted = true;
        nums.forEach(function (el) {
          var m = el.textContent.trim().match(/^(\d+)(.*)$/);
          if (!m) return;
          countUp(el, parseInt(m[1], 10), m[2]);
        });
        io2.disconnect();
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io2.observe(el); });
  }

  /* ---------- smooth anchor scrolling that respects the sticky nav ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (!id || id === '#') return;
    var el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    var top = el.getBoundingClientRect().top + window.pageYOffset - 10;
    window.scrollTo({ top: top, behavior: 'smooth' });
    history.replaceState(null, '', id);
  });
})();

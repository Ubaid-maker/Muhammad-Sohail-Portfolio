/* Muhammad Sohail — portfolio behaviour
   Renders the work from data.js, filters by client, runs the viewer. */

(function () {
  'use strict';

  var DATA = window.PORTFOLIO || [];
  var THUMB = 'assets/img/thumb/';
  var FULL = 'assets/img/work/';

  var brandsEl = document.getElementById('brands');
  var chipsEl = document.getElementById('chips');
  var emptyEl = document.getElementById('empty');
  var wallEl = document.getElementById('wall');

  /* ---------- hero wall ---------- */
  function buildWall() {
    if (!wallEl) return;
    var pool = [];
    DATA.forEach(function (b) {
      b.items.forEach(function (it) { pool.push(it.id); });
    });
    // spread brands out so no column is one client
    pool.sort(function () { return Math.random() - 0.5; });

    var cols = 5;
    for (var c = 0; c < cols; c++) {
      var col = document.createElement('div');
      col.className = 'wall-col';
      var slice = [];
      for (var i = c; i < pool.length; i += cols) slice.push(pool[i]);
      // duplicate the set so the -50% loop is seamless
      slice.concat(slice).forEach(function (id) {
        var img = document.createElement('img');
        img.src = THUMB + id + '.jpg';
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        col.appendChild(img);
      });
      wallEl.appendChild(col);
    }
  }

  /* ---------- work sections ---------- */
  function buildWork() {
    DATA.forEach(function (b) {
      var sec = document.createElement('section');
      sec.className = 'brand';
      sec.id = 'c-' + b.slug;
      sec.dataset.slug = b.slug;

      var meta = document.createElement('div');
      meta.className = 'brand-meta';

      var h = document.createElement('h2');
      h.className = 'brand-name';
      h.textContent = b.name;
      meta.appendChild(h);

      var facts = document.createElement('ul');
      facts.className = 'brand-facts';
      var rows = [
        ['Sector', b.sector],
        ['Market', b.market],
        ['Pieces', String(b.items.length)]
      ];
      if (b.site) rows.push(['Site', b.site]);
      rows.forEach(function (r) {
        var li = document.createElement('li');
        var lab = document.createElement('b');
        lab.textContent = r[0];
        var val = document.createElement('span');
        val.textContent = r[1];
        li.appendChild(lab);
        li.appendChild(val);
        facts.appendChild(li);
      });
      meta.appendChild(facts);

      var note = document.createElement('p');
      note.className = 'brand-note';
      note.textContent = b.note;
      meta.appendChild(note);

      var tiles = document.createElement('div');
      tiles.className = 'tiles';

      b.items.forEach(function (it) {
        var btn = document.createElement('button');
        btn.className = 'tile';
        btn.type = 'button';
        btn.dataset.id = it.id;
        btn.setAttribute('aria-label', 'View: ' + it.caption + ' — ' + b.name);

        var img = document.createElement('img');
        img.src = THUMB + it.id + '.jpg';
        img.alt = it.caption + ' — ' + b.name;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = it.w;
        img.height = it.h;

        var cap = document.createElement('span');
        cap.className = 'tile-cap';
        cap.textContent = it.caption;

        btn.appendChild(img);
        btn.appendChild(cap);
        tiles.appendChild(btn);
      });

      sec.appendChild(meta);
      sec.appendChild(tiles);
      brandsEl.appendChild(sec);
    });
  }

  /* ---------- filter chips ---------- */
  function buildChips() {
    var all = [{ slug: 'all', name: 'All work' }].concat(DATA);
    all.forEach(function (b, i) {
      var btn = document.createElement('button');
      btn.className = 'chip';
      btn.type = 'button';
      btn.textContent = b.name;
      btn.dataset.slug = b.slug;
      btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', function () { applyFilter(b.slug); });
      chipsEl.appendChild(btn);
    });
  }

  function applyFilter(slug) {
    var shown = 0;
    Array.prototype.forEach.call(brandsEl.children, function (sec) {
      var on = slug === 'all' || sec.dataset.slug === slug;
      sec.hidden = !on;
      if (on) shown++;
    });
    Array.prototype.forEach.call(chipsEl.children, function (c) {
      c.setAttribute('aria-pressed', c.dataset.slug === slug ? 'true' : 'false');
    });
    emptyEl.hidden = shown > 0;
    collectVisible();

    var work = document.getElementById('work');
    var bar = document.getElementById('index');
    var top = work.getBoundingClientRect().top + window.pageYOffset - bar.offsetHeight - 8;
    if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }

  /* ---------- lightbox ---------- */
  var order = [];   // ids currently visible, in DOM order
  var lookup = {};  // id -> {caption, brand}
  var cursor = -1;
  var lastFocus = null;

  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbBrand = document.getElementById('lbBrand');
  var lbCaption = document.getElementById('lbCaption');
  var lbCount = document.getElementById('lbCount');

  function buildLookup() {
    DATA.forEach(function (b) {
      b.items.forEach(function (it) {
        lookup[it.id] = { caption: it.caption, brand: b.name };
      });
    });
  }

  function collectVisible() {
    order = [];
    Array.prototype.forEach.call(brandsEl.children, function (sec) {
      if (sec.hidden) return;
      Array.prototype.forEach.call(sec.querySelectorAll('.tile'), function (t) {
        order.push(t.dataset.id);
      });
    });
  }

  function show(i) {
    if (!order.length) return;
    cursor = (i + order.length) % order.length;
    var id = order[cursor];
    var meta = lookup[id];
    lbImg.src = FULL + id + '.jpg';
    lbImg.alt = meta.caption + ' — ' + meta.brand;
    lbBrand.textContent = meta.brand;
    lbCaption.textContent = meta.caption;
    lbCount.textContent = (cursor + 1) + ' of ' + order.length;
  }

  function open(id) {
    collectVisible();
    var i = order.indexOf(id);
    if (i < 0) return;
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    show(i);
    document.getElementById('lbClose').focus();
  }

  function close() {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  brandsEl.addEventListener('click', function (e) {
    var tile = e.target.closest('.tile');
    if (tile) open(tile.dataset.id);
  });

  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { show(cursor - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(cursor + 1); });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb-figure')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(cursor + 1);
    else if (e.key === 'ArrowLeft') show(cursor - 1);
  });

  /* swipe on touch */
  var sx = 0;
  lb.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 55) show(cursor + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- go ---------- */
  buildWall();
  buildWork();
  buildChips();
  buildLookup();
  collectVisible();
})();

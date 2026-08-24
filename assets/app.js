/* BONATI — Checklist Meta Ads · lógica de aplicação */

(function () {
  'use strict';

  var KEY = 'bonati_checklist_meta_ads_v1';
  var done = {};
  var canPersist = true;

  var el = {
    phases: document.getElementById('phases'),
    arc: document.getElementById('dialArc'),
    num: document.getElementById('dialNum'),
    den: document.getElementById('dialDen'),
    phaseline: document.getElementById('phaseline'),
    ticks: document.getElementById('ticks'),
    filter: document.getElementById('filter'),
    reportBox: document.getElementById('reportbox'),
    reportText: document.getElementById('reporttext'),
    year: document.getElementById('year')
  };

  /* ---------- persistência ---------- */

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) done = JSON.parse(raw) || {};
    } catch (e) {
      canPersist = false;
    }
  }

  var saveTimer = null;
  function save() {
    if (!canPersist) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(done));
      } catch (e) {
        canPersist = false;
        paint();
      }
    }, 150);
  }

  /* ---------- construção ---------- */

  var CHECK_SVG =
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8.6 6 12.4 14 3.6" fill="none" ' +
    'stroke="#EFD4A3" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var total = 0;

  function build() {
    var html = '';
    CHECKLIST.forEach(function (ph, pi) {
      html +=
        '<section class="phase" id="ph' + pi + '">' +
          '<div class="phase-head">' +
            '<span class="folio">' + ph.n + '</span>' +
            '<h3>' + ph.title + '</h3>' +
            '<span class="tally" id="ty' + pi + '"></span>' +
          '</div>' +
          '<p class="lede">' + ph.lede + '</p>' +
          '<ul class="items">';

      ph.items.forEach(function (it, ii) {
        var id = pi + '-' + ii;
        total++;
        html +=
          '<li id="li' + id + '">' +
            '<label class="item">' +
              '<input type="checkbox" data-id="' + id + '">' +
              '<span class="box">' + CHECK_SVG + '</span>' +
              '<span class="txt">' + it.t +
                (it.link
                  ? ' <a href="' + it.link[1] + '" target="_blank" rel="noopener noreferrer">' + it.link[0] + '</a>'
                  : '') +
              '</span>' +
            '</label>' +
            (it.why
              ? '<details><summary>por quê</summary><p>' + it.why + '</p></details>'
              : '') +
          '</li>';
      });

      html += '</ul></section>';
    });

    el.phases.innerHTML = html;

    var tickHtml = '';
    for (var i = 0; i < total; i++) tickHtml += '<i></i>';
    el.ticks.innerHTML = tickHtml;

    el.phases.addEventListener('change', function (e) {
      var box = e.target;
      if (!box || box.type !== 'checkbox') return;
      if (box.checked) done[box.dataset.id] = 1;
      else delete done[box.dataset.id];
      save();
      paint();
    });
  }

  /* ---------- pintura de estado ---------- */

  var ARC_LEN = 2 * Math.PI * 52;

  function paint() {
    var hit = 0;
    var fullPhases = 0;
    var onlyPending = el.filter.checked;
    var flat = [];

    CHECKLIST.forEach(function (ph, pi) {
      var pc = 0;
      ph.items.forEach(function (it, ii) {
        var id = pi + '-' + ii;
        var li = document.getElementById('li' + id);
        var isDone = !!done[id];
        li.querySelector('input').checked = isDone;
        li.classList.toggle('on', isDone);
        li.classList.toggle('hidden', onlyPending && isDone);
        if (isDone) pc++;
        flat.push(isDone);
      });
      hit += pc;
      if (pc === ph.items.length) fullPhases++;
      document.getElementById('ty' + pi).textContent = pc + ' / ' + ph.items.length;
      document.getElementById('ph' + pi).classList.toggle('done', pc === ph.items.length);
    });

    var ticks = el.ticks.children;
    for (var i = 0; i < ticks.length; i++) ticks[i].classList.toggle('on', flat[i]);

    el.num.textContent = hit;
    el.den.textContent = 'DE ' + total;
    el.arc.style.strokeDasharray = ARC_LEN;
    el.arc.style.strokeDashoffset = ARC_LEN * (1 - (total ? hit / total : 0));

    var line;
    if (hit === total) line = 'Implantação completa.';
    else if (fullPhases === 0) line = 'Nenhuma fase concluída ainda.';
    else line = fullPhases + (fullPhases === 1 ? ' fase concluída' : ' fases concluídas') + ' de ' + CHECKLIST.length + '.';
    if (!canPersist) line += ' O progresso não está sendo salvo neste navegador.';
    el.phaseline.textContent = line;
  }

  /* ---------- controles ---------- */

  el.filter.addEventListener('change', paint);

  document.getElementById('print').addEventListener('click', function () {
    window.print();
  });

  document.getElementById('reset').addEventListener('click', function () {
    if (!window.confirm('Desmarcar todos os itens do checklist?')) return;
    done = {};
    save();
    paint();
  });

  document.getElementById('report').addEventListener('click', function () {
    var lines = ['CHECKLIST META ADS — BONATI', 'Status em ' + new Date().toLocaleDateString('pt-BR'), ''];
    CHECKLIST.forEach(function (ph, pi) {
      var pend = ph.items.filter(function (it, ii) { return !done[pi + '-' + ii]; });
      lines.push('FASE ' + ph.n + ' — ' + ph.title.toUpperCase() + '  [' + (ph.items.length - pend.length) + '/' + ph.items.length + ']');
      if (!pend.length) lines.push('  concluída');
      else pend.forEach(function (it) { lines.push('  [ ] ' + it.t); });
      lines.push('');
    });
    el.reportText.value = lines.join('\n');
    el.reportBox.classList.add('open');
    el.reportText.focus();
    el.reportText.select();
  });

  document.getElementById('copy').addEventListener('click', function () {
    var btn = this;
    var original = btn.textContent;
    function feedback(msg) {
      btn.textContent = msg;
      setTimeout(function () { btn.textContent = original; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(el.reportText.value)
        .then(function () { feedback('Copiado'); })
        .catch(function () { feedback('Selecione e copie'); });
    } else {
      el.reportText.select();
      feedback('Selecione e copie');
    }
  });

  /* ---------- boot ---------- */

  el.year.textContent = new Date().getFullYear();
  load();
  build();
  paint();
})();

/* BONATI — Checklist Meta Ads · lógica de aplicação
   Progresso sincronizado em tempo real via Supabase (tabela checklist_progress).
   Se o Supabase não estiver disponível, cai para localStorage (modo local).
*/

(function () {
  'use strict';

  var LOCAL_KEY = 'bonati_checklist_meta_ads_v1';
  var WHO_KEY = 'bonati_checklist_who_v1';
  var TABLE = 'checklist_progress';

  var done = {};        // done[id] = nome de quem marcou (string) ou true
  var canPersist = true;
  var mode = 'local';    // 'remote' | 'local'
  var sb = null;
  var who = null;

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
    year: document.getElementById('year'),
    sync: document.getElementById('syncstatus'),
    whoBtn: document.getElementById('whoami')
  };

  /* ---------- identidade local (quem está marcando) ---------- */

  function loadWho() {
    try {
      who = window.localStorage.getItem(WHO_KEY) || null;
    } catch (e) {
      who = null;
    }
    updateWhoBtn();
  }

  function askWho() {
    var name = window.prompt(
      'Seu nome (aparece para a equipe quando você marcar um item):',
      who || ''
    );
    if (name === null) return;
    name = name.trim();
    who = name || null;
    try {
      if (who) window.localStorage.setItem(WHO_KEY, who);
      else window.localStorage.removeItem(WHO_KEY);
    } catch (e) { /* ignore */ }
    updateWhoBtn();
  }

  function updateWhoBtn() {
    if (!el.whoBtn) return;
    el.whoBtn.textContent = who ? ('Você: ' + who) : 'Informar seu nome';
  }

  /* ---------- status de sincronização ---------- */

  function setSync(text, cls) {
    if (!el.sync) return;
    el.sync.textContent = text;
    el.sync.className = 'syncstatus' + (cls ? ' ' + cls : '');
  }

  /* ---------- persistência local (fallback) ---------- */

  function loadLocal() {
    try {
      var raw = window.localStorage.getItem(LOCAL_KEY);
      if (raw) done = JSON.parse(raw) || {};
    } catch (e) {
      canPersist = false;
    }
  }

  var saveTimer = null;
  function saveLocal() {
    if (!canPersist) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        window.localStorage.setItem(LOCAL_KEY, JSON.stringify(done));
      } catch (e) {
        canPersist = false;
        paint();
      }
    }, 150);
  }

  /* ---------- persistência remota (Supabase) ---------- */

  function initSupabase() {
    if (
      typeof window.supabase === 'undefined' ||
      !window.SUPABASE_URL ||
      !window.SUPABASE_ANON_KEY
    ) {
      mode = 'local';
      return false;
    }
    try {
      sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
      mode = 'remote';
      return true;
    } catch (e) {
      mode = 'local';
      return false;
    }
  }

  function loadRemote() {
    setSync('Sincronizando…', 'pending');
    return sb
      .from(TABLE)
      .select('item_id, done_by')
      .then(function (res) {
        if (res.error) throw res.error;
        done = {};
        (res.data || []).forEach(function (row) {
          done[row.item_id] = row.done_by || true;
        });
        setSync('Sincronizado em tempo real', 'ok');
      })
      .catch(function (err) {
        console.error('Falha ao carregar progresso do Supabase:', err);
        setSync('Sem conexão — usando cópia local', 'error');
        mode = 'local';
        loadLocal();
      });
  }

  function subscribeRealtime() {
    sb.channel('checklist_progress_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE },
        function (payload) {
          if (payload.eventType === 'DELETE') {
            delete done[payload.old.item_id];
          } else {
            done[payload.new.item_id] = payload.new.done_by || true;
          }
          paint();
        }
      )
      .subscribe(function (status) {
        if (status === 'SUBSCRIBED') setSync('Sincronizado em tempo real', 'ok');
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setSync('Conexão em tempo real perdida — tentando reconectar…', 'error');
        }
      });
  }

  function remoteMark(id, isDone) {
    if (isDone) {
      done[id] = who || true;
      sb.from(TABLE)
        .upsert({ item_id: id, done_by: who || null }, { onConflict: 'item_id' })
        .then(function (res) {
          if (res.error) {
            console.error('Falha ao salvar item:', res.error);
            setSync('Erro ao salvar — verifique sua conexão', 'error');
          }
        });
    } else {
      delete done[id];
      sb.from(TABLE)
        .delete()
        .eq('item_id', id)
        .then(function (res) {
          if (res.error) {
            console.error('Falha ao desmarcar item:', res.error);
            setSync('Erro ao salvar — verifique sua conexão', 'error');
          }
        });
    }
  }

  function mark(id, isDone) {
    if (mode === 'remote' && sb) {
      remoteMark(id, isDone);
    } else {
      if (isDone) done[id] = who || 1;
      else delete done[id];
      saveLocal();
    }
    paint();
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
                ' <span class="who-badge" id="wb' + id + '"></span>' +
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
      if (mode === 'remote' && box.checked && !who) askWho();
      mark(box.dataset.id, box.checked);
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
        var val = done[id];
        var isDone = !!val;
        li.querySelector('input').checked = isDone;
        li.classList.toggle('on', isDone);
        li.classList.toggle('hidden', onlyPending && isDone);
        var wb = document.getElementById('wb' + id);
        if (wb) wb.textContent = (isDone && typeof val === 'string') ? ('· ' + val) : '';
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
    if (mode === 'local' && !canPersist) line += ' O progresso não está sendo salvo neste navegador.';
    el.phaseline.textContent = line;
  }

  /* ---------- controles ---------- */

  el.filter.addEventListener('change', paint);

  if (el.whoBtn) {
    el.whoBtn.addEventListener('click', function () { askWho(); });
  }

  document.getElementById('print').addEventListener('click', function () {
    window.print();
  });

  document.getElementById('reset').addEventListener('click', function () {
    if (!window.confirm('Desmarcar todos os itens do checklist para todo mundo?')) return;
    if (mode === 'remote' && sb) {
      done = {};
      paint();
      sb.from(TABLE).delete().neq('item_id', '').then(function (res) {
        if (res.error) {
          console.error('Falha ao limpar checklist:', res.error);
          setSync('Erro ao limpar — verifique sua conexão', 'error');
        }
      });
    } else {
      done = {};
      saveLocal();
      paint();
    }
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
  loadWho();
  build();

  if (initSupabase()) {
    loadRemote().then(function () {
      paint();
      subscribeRealtime();
    });
  } else {
    setSync('Modo local (sem sincronização entre pessoas)', 'error');
    loadLocal();
    paint();
  }
})();

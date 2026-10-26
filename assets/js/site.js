/* -------------------------------------------------------------------------
   Monta a pagina a partir de eventos.js e cuida do que nao e animacao:
   ano do rodape, letreiro do tamanho da tela e rolagem para as secoes.
   As animacoes ficam no anima.js.
------------------------------------------------------------------------- */
(() => {
    const $ = (s) => document.querySelector(s);
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const pad = (n) => String(n).padStart(2, '0');
    const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    // ---------- Eventos ----------
    const evs = (window.IMNOTKIQ_EVENTOS || []).map((e, i) => {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(e.data || '').trim());
        return { ...e, ord: i, dt: m ? new Date(+m[1], +m[2] - 1, +m[3]) : null };
    }).sort((a, b) => (!a.dt && !b.dt) ? a.ord - b.ord : !a.dt ? -1 : !b.dt ? 1 : b.dt - a.dt);
    evs.slice().reverse().forEach((e, i) => { e.n = i + 1; });
    evs.forEach((e) => {
        e.code = (String(e.categoria || 'E').trim()[0] || 'E').toUpperCase() + pad(e.n);
        e.quando = e.dt ? `${pad(e.dt.getDate())} ${MES[e.dt.getMonth()]} ${String(e.dt.getFullYear()).slice(2)}` : 'A confirmar';
        e.link = /^https?:\/\//i.test(e.drive || '') ? e.drive : '';
        e.fotos = Array.isArray(e.fotos) ? e.fotos.filter(Boolean) : [];
    });
    window.IMNOTKIQ = { evs };

    const top = evs[0];
    if (top) {
        $('#pc-k').textContent = `Último evento · ${top.categoria || ''}`;
        $('#pc-t').innerHTML = esc(top.nome).replace(' ', '<br>');
        $('#pd-code').textContent = top.code;
        if (top.fotos[0]) {
            $('#pd-img').src = top.fotos[0];
            $('#pd-img').alt = `${top.nome}, foto em destaque`;
        }
        $('#ft-t').innerHTML = `${esc(top.nome)}<sup>${pad(top.n)}</sup>`;
        $('#ft-meta').innerHTML = `<span>${esc(top.categoria || 'Evento')}</span><i>·</i><span class="v">${esc(top.quando)}</span>`;
        $('#ft-photos').innerHTML = top.fotos.slice(0, 3).map((src, i) => (
            `<span class="duo" data-cursor="${top.link ? 'Drive ↗' : 'Em breve'}"><img src="${esc(src)}" alt="${esc(top.nome)}, foto ${i + 1}" width="215" height="289" loading="lazy" decoding="async"></span>`
        )).join('') + '<span class="plus">+</span><span class="plus">+</span>';
        $('#ft-cta').innerHTML = top.link
            ? `<a class="cta lbl" href="${esc(top.link)}" target="_blank" rel="noopener" data-magnetico>Abrir drive ↗</a>`
            : '<span class="cta lbl">Fotos em breve</span>';
        $('#ft-giant').textContent = top.code;
        if (top.link) {
            $('#pd').href = top.link;
            $('#pd').target = '_blank';
            $('#pd').rel = 'noopener';
            $('#pd').dataset.cursor = 'Drive ↗';
        }
    } else {
        $('#pc-t').textContent = 'Em breve';
        $('#destaque').hidden = true;
    }

    $('#gal-n').textContent = `${pad(evs.length)} ${evs.length === 1 ? 'evento' : 'eventos'}`;
    $('#evlist').innerHTML = evs.length ? evs.map((e) => {
        const tag = e.link ? 'a' : 'div';
        const attrs = e.link ? `href="${esc(e.link)}" target="_blank" rel="noopener" data-cursor="Drive ↗"` : '';
        return `<${tag} class="evc" ${attrs}><span><span class="lbl">${esc(e.quando)}</span><span class="n">${esc(e.nome)}</span></span><span class="chip">${esc(e.code)}</span></${tag}>`;
    }).join('') : '<div class="evc"><span class="n">Primeiro evento em breve</span></div>';

    // Faixa: o nome e os eventos, separados pela estrela
    const estrela = '<svg class="faixa-estrela" aria-hidden="true"><use href="#estrela"/></svg>';
    const itens = ['imnotkiq', ...evs.map((e) => e.nome)];
    const volta = itens.map((t) => `<span class="item">${esc(t)}${estrela}</span>`).join('');
    ['#faixa-1', '#faixa-2'].forEach((id) => { $(id).innerHTML = volta.repeat(6); });

    document.querySelectorAll('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    // ---------- Letreiro gigante do tamanho da largura ----------
    // Mede a largura real do texto (as fontes variam por navegador) e corrige o tamanho.
    (() => {
        const letreiro = $('#sync');
        if (!letreiro) return;
        let larguraVista = 0;
        const ajustar = () => {
            letreiro.style.fontSize = '';
            const faixa = document.createRange();
            faixa.selectNodeContents(letreiro);
            const ocupa = faixa.getBoundingClientRect().width;
            const cabe = letreiro.parentElement.clientWidth * 1.06; // passa um pouco da borda, cortado de proposito
            if (ocupa && cabe) letreiro.style.fontSize = `${(parseFloat(getComputedStyle(letreiro).fontSize) * cabe) / ocupa}px`;
        };
        document.fonts?.ready.then(ajustar);
        window.addEventListener('load', ajustar);
        if (window.ResizeObserver) {
            // so a largura importa: a altura muda com o proprio ajuste
            new ResizeObserver(([item]) => {
                if (Math.round(item.contentRect.width) === larguraVista) return;
                larguraVista = Math.round(item.contentRect.width);
                ajustar();
            }).observe(letreiro.parentElement);
        }
    })();

    // ---------- Links para secoes: rolam sem "#" no endereco ----------
    // O anima.js troca esta funcao pela rolagem suave do Lenis.
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.IMNOTKIQ_ROLAR = (alvo) => alvo.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' });
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
        const alvo = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
        if (!alvo) return;
        event.preventDefault();
        window.IMNOTKIQ_ROLAR(alvo);
    });

    // Para quem abrir o console
    console.log('%c✦ imnotkiq %c se tu tá lendo isso, me chama na DM: @imnotkiq',
        'background:#5b2cf6;color:#f6f5f2;font:700 14px "Inter Tight",sans-serif;padding:6px 10px',
        'color:#ff5418;font:600 12px "Inter Tight",sans-serif');
})();

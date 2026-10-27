/* Monta a página a partir de window.IMNOTKIQ_EVENTOS (assets/js/eventos.js). */
(function () {
    'use strict';

    var eventos = window.IMNOTKIQ_EVENTOS || [];
    var ultimo = eventos[0];
    var MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    function el(tag, classe, texto) {
        var e = document.createElement(tag);
        if (classe) e.className = classe;
        if (texto != null) e.textContent = texto;
        return e;
    }
    function formataData(iso) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
        return m ? Number(m[3]) + ' ' + MESES[Number(m[2]) - 1] + ' ' + m[1] : '';
    }
    function info(ev) {
        return [ev.categoria, ev.local, formataData(ev.data)].filter(Boolean).join(' · ');
    }
    function abreFora(a, href) {
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener';
        return a;
    }
    function quandoCarregar(img) {
        function pronto() { img.classList.add('carregou'); }
        if (img.complete) pronto();
        else { img.addEventListener('load', pronto); img.addEventListener('error', pronto); }
    }

    document.querySelectorAll('[data-ano]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

    // ---------- Último evento ----------
    var destaque = document.getElementById('destaque');
    if (ultimo) {
        var texto = el('div', 'destaque-texto');
        texto.append(el('p', 'rotulo', 'Último evento'), el('h1', 'evento', ultimo.nome));
        if (info(ultimo)) texto.append(el('p', 'meta', info(ultimo)));
        if (ultimo.drive) {
            var botao = abreFora(el('a', 'botao', 'Ver as fotos no Drive'), ultimo.drive);
            botao.append(el('span', 'seta', '↗'));
            texto.append(botao);
        } else {
            texto.append(el('span', 'botao em-breve', 'Fotos em breve'));
        }
        destaque.append(texto);

        if (ultimo.fotos && ultimo.fotos.length) {
            var capa = el('figure', 'destaque-foto');
            var img = new Image(1080, 1350);
            img.src = ultimo.fotos[0];
            img.alt = ultimo.nome;
            img.fetchPriority = 'high';
            capa.append(img);
            destaque.append(capa);
        }
    }

    // ---------- Eventos anteriores ----------
    if (eventos.length > 1) {
        var lista = document.getElementById('lista');
        eventos.slice(1).forEach(function (ev, k) {
            var li = el('li');
            var linha = ev.drive ? abreFora(el('a', 'linha'), ev.drive) : el('div', 'linha');
            linha.append(
                el('span', 'num', String(eventos.length - k - 1).padStart(2, '0')),
                el('span', 'nome', ev.nome),
                el('span', 'info', info(ev)),
                el('span', 'acao', ev.drive ? 'Fotos ↗' : 'Em breve')
            );
            li.append(linha);
            lista.append(li);
        });
        document.getElementById('eventos').hidden = false;
    }

    // ---------- Galeria ----------
    var fotos = (ultimo && ultimo.fotos) || [];
    if (!fotos.length) {
        document.getElementById('galeria').hidden = true;
    } else {
        document.getElementById('galeria-titulo').textContent = ultimo.nome + ' · seleção';
        if (ultimo.drive) abreFora(document.getElementById('galeria-drive'), ultimo.drive).hidden = false;

        var grade = document.getElementById('grade');
        fotos.forEach(function (src, k) {
            var li = el('li');
            var quadro = el('button', 'quadro');
            quadro.type = 'button';
            quadro.setAttribute('aria-label', 'Abrir foto ' + (k + 1) + ' de ' + fotos.length);
            var img = new Image(1080, 1350);
            img.loading = 'lazy';
            img.decoding = 'async';
            img.alt = '';
            img.src = src;
            quandoCarregar(img);
            quadro.append(img);
            quadro.addEventListener('click', function () { abre(k); });
            li.append(quadro);
            grade.append(li);
        });
    }

    // ---------- Foto grande ----------
    var visor = document.getElementById('visor');
    var vFoto = document.getElementById('visor-foto');
    var vConta = document.getElementById('visor-conta');
    var atual = 0;

    function mostra(k) {
        atual = (k + fotos.length) % fotos.length;
        vFoto.src = fotos[atual];
        vFoto.alt = ultimo.nome + ', foto ' + (atual + 1) + ' de ' + fotos.length;
        vConta.textContent = (atual + 1) + ' / ' + fotos.length;
        new Image().src = fotos[(atual + 1) % fotos.length];
    }
    function abre(k) {
        if (typeof visor.showModal !== 'function') { window.open(fotos[k], '_blank', 'noopener'); return; }
        mostra(k);
        visor.showModal();
    }

    document.getElementById('visor-fechar').addEventListener('click', function () { visor.close(); });
    document.getElementById('visor-ant').addEventListener('click', function () { mostra(atual - 1); });
    document.getElementById('visor-prox').addEventListener('click', function () { mostra(atual + 1); });
    visor.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') mostra(atual - 1);
        else if (e.key === 'ArrowRight') mostra(atual + 1);
    });

    // arrastar pro lado troca a foto; tocar fora da foto fecha
    var x0 = null, arrastou = false;
    visor.addEventListener('pointerdown', function (e) { x0 = e.clientX; arrastou = false; });
    visor.addEventListener('pointerup', function (e) {
        if (x0 === null) return;
        var dx = e.clientX - x0;
        x0 = null;
        if (Math.abs(dx) > 50) { arrastou = true; mostra(atual + (dx < 0 ? 1 : -1)); }
    });
    visor.addEventListener('click', function (e) {
        if (!arrastou && e.target === visor) visor.close();
        arrastou = false;
    });

    // ---------- Assinatura do rodapé: ocupa a largura toda ----------
    var assinatura = document.getElementById('assinatura');
    var largura = 0;
    function ajusta() {
        var caixa = assinatura.parentNode.clientWidth;
        if (!caixa || caixa === largura) return;
        largura = caixa;
        assinatura.style.fontSize = '100px';
        assinatura.style.fontSize = (100 * caixa / assinatura.getBoundingClientRect().width) + 'px';
    }
    ajusta();
    window.addEventListener('resize', function () { requestAnimationFrame(ajusta); });
})();

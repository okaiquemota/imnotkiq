/* Monta a capa e os drives a partir de window.IMNOTKIQ_EVENTOS (assets/js/eventos.js). */
(function () {
    'use strict';

    var eventos = window.IMNOTKIQ_EVENTOS || [];

    // A capa é a do evento mais novo, o primeiro da lista
    var capa = document.getElementById('capa');
    var ultimo = eventos[0];
    if (ultimo && ultimo.capa) {
        capa.src = ultimo.capa;
        capa.alt = ultimo.nome + ', foto de capa';
    }

    // Um link por evento; sem drive ainda, aparece "em breve" em cinza
    var lista = document.getElementById('drives');
    eventos.forEach(function (ev) {
        var li = document.createElement('li');
        if (/^https?:\/\//i.test(ev.drive || '')) {
            var a = document.createElement('a');
            a.href = ev.drive;
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = ev.nome + ' ↗';
            li.append(a);
        } else {
            var aguardando = document.createElement('span');
            aguardando.className = 'em-breve';
            aguardando.textContent = ev.nome + ' · em breve';
            li.append(aguardando);
        }
        lista.append(li);
    });

    document.querySelectorAll('[data-ano]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

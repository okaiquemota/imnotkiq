/* -------------------------------------------------------------------------
   Movimento do site: abertura, entradas, rolagem suave, faixa, cursor e
   easter eggs. Usa GSAP + ScrollTrigger + Lenis (assets/js/vendor).
   Se o visitante pedir menos movimento, ou se as bibliotecas faltarem,
   nada disto roda e a pagina fica no layout parado do site.css.
------------------------------------------------------------------------- */
(() => {
    const html = document.documentElement;
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduzir || !window.gsap || !window.ScrollTrigger) {
        html.classList.remove('intro-ativa', 'anima-pre');
        return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ nullTargetWarn: false });
    html.classList.add('anima');

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => gsap.utils.toArray(s);
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ---------- Rolagem suave ----------
    let lenis = null;
    if (window.Lenis) {
        lenis = new window.Lenis({ lerp: 0.08, wheelMultiplier: 0.8 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
        gsap.ticker.lagSmoothing(0);
        window.IMNOTKIQ_ROLAR = (alvo) => lenis.scrollTo(alvo, { duration: 1.4, offset: -12 });
    }

    // ---------- Divide um titulo em letras ----------
    function letras(el) {
        if (!el) return [];
        if (el.dataset.dividido) return el.querySelectorAll('.l');
        el.dataset.dividido = '1';
        if (!el.getAttribute('aria-label')) {
            const copia = el.cloneNode(true);
            copia.querySelectorAll('sup').forEach((s) => s.remove());
            el.setAttribute('aria-label', copia.textContent.replace(/\s+/g, ' ').trim());
        }
        const percorrer = (no) => {
            [...no.childNodes].forEach((filho) => {
                if (filho.nodeType === Node.TEXT_NODE) {
                    const pedacos = document.createDocumentFragment();
                    filho.textContent.split(/(\s+)/).forEach((parte) => {
                        if (!parte) return;
                        if (/^\s+$/.test(parte)) {
                            pedacos.appendChild(document.createTextNode(' '));
                            return;
                        }
                        const palavra = document.createElement('span');
                        palavra.className = 'm';
                        palavra.setAttribute('aria-hidden', 'true');
                        [...parte].forEach((c) => {
                            const l = document.createElement('span');
                            l.className = 'l';
                            l.textContent = c;
                            palavra.appendChild(l);
                        });
                        pedacos.appendChild(palavra);
                    });
                    filho.replaceWith(pedacos);
                } else if (filho.nodeType === Node.ELEMENT_NODE && !['BR', 'SUP'].includes(filho.tagName)) {
                    percorrer(filho);
                }
            });
        };
        percorrer(el);
        // o numero sobrescrito fica grudado na ultima palavra, sem quebrar a linha entre os dois
        const sup = el.querySelector('sup');
        const palavras = el.querySelectorAll('.m');
        if (sup && palavras.length) palavras[palavras.length - 1].appendChild(sup);
        return el.querySelectorAll('.l');
    }

    // Entrada suave (a mesma da MovCode): a letra sobe saindo do desfoque
    const ENTRADA = { yPercent: 40, opacity: 0, filter: 'blur(12px)' };
    const CHEGADA = { yPercent: 0, opacity: 1, filter: 'blur(0px)', ease: 'power3.out', clearProps: 'filter' };
    const revelar = (el, extra = {}) => {
        const ls = letras(el);
        if (!ls.length) return;
        gsap.fromTo(ls, ENTRADA, { ...CHEGADA, duration: 1.1, stagger: 0.035, scrollTrigger: { trigger: el, start: 'top 88%' }, ...extra });
    };

    // ---------- Topo ----------
    const nome = letras($('.name'));
    const paineis = $$('.comp > *');
    document.querySelectorAll('.wire .desenha').forEach((p) => p.setAttribute('pathLength', '1'));
    gsap.set(paineis, { clipPath: 'inset(0% 100% 0% 0%)' });
    gsap.set(nome, ENTRADA);
    gsap.set('.hline', { scaleX: 0 });
    gsap.set('.wire .desenha', { strokeDasharray: 1, strokeDashoffset: 1 });
    html.classList.remove('anima-pre');

    const tlTopo = gsap.timeline({ paused: true })
        .from('.topo .tagbar, .topo-link', { y: -24, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0)
        .to('.hline', { scaleX: 1, duration: 1.2, ease: 'expo.inOut' }, 0)
        .to(paineis, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.95, ease: 'expo.inOut', stagger: 0.12, clearProps: 'clipPath' }, 0.1)
        .from('#pd-img', { scale: 1.35, duration: 1.6, ease: 'power3.out', clearProps: 'transform' }, 0.35)
        .to(nome, { ...CHEGADA, duration: 1.1, stagger: 0.045 }, 0.45)
        .from('.tab span, .pA .cap, .pB .s, .pC .rule, .pC .t', { y: 18, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 }, 0.75)
        .from('.pc-hatch', { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.8, ease: 'expo.out' }, 0.9)
        .to('.wire .desenha', { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: 0.25 }, 0.8)
        .from('#pd-code', { yPercent: -40, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, 0.9)
        .from('.pD .go', { y: 14, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 1.1)
        .from('.logo-botao svg', { rotate: -144, scale: 0, duration: 0.9, ease: 'back.out(1.8)' }, 0.8)
        .from('.deco', { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 0.6)
        .from('.hero .plus', { rotate: -180, scale: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.05 }, 1);

    // Abertura: so na primeira visita da sessao
    const intro = $('.intro');
    if (html.classList.contains('intro-ativa') && intro) {
        lenis?.stop();
        intro.style.animation = 'none';
        try {
            sessionStorage.setItem('imnotkiq_intro', '1');
        } catch {
            // sem sessionStorage a abertura aparece de novo na proxima visita
        }
        gsap.timeline({
            onComplete: () => {
                html.classList.remove('intro-ativa');
                intro.remove();
                lenis?.start();
            }
        })
            .from('.intro-estrela', { scale: 0, rotate: -220, duration: 0.9, ease: 'back.out(1.6)' })
            .from('.intro-tag', { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.6, ease: 'expo.out' }, 0.45)
            .to('.intro-estrela', { rotate: '+=144', duration: 0.5, ease: 'power2.inOut' }, '+=0.15')
            .to(intro, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' })
            .add(() => tlTopo.play(), '-=0.55');
    } else {
        html.classList.remove('intro-ativa');
        intro?.remove();
        tlTopo.play();
    }

    // Com a rolagem: o nome sobe devagar, a foto aproxima e as hachuras andam em velocidades diferentes
    const rolagemTopo = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.name', { yPercent: -12, ease: 'none', scrollTrigger: rolagemTopo });
    gsap.fromTo('.pD .duo', { scale: 1 }, { scale: 1.14, yPercent: 5, ease: 'none', scrollTrigger: rolagemTopo });
    $$('[data-vel]').forEach((el) => {
        gsap.to(el, { y: () => -parseFloat(el.dataset.vel), ease: 'none', scrollTrigger: rolagemTopo });
    });

    // ---------- Faixa: acelera e inclina com a velocidade da rolagem ----------
    const linhas = $$('.faixa-linha');
    const voltas = linhas.map((linha, i) => (
        i % 2
            ? gsap.fromTo(linha, { xPercent: -50 }, { xPercent: 0, duration: 30, ease: 'none', repeat: -1 })
            : gsap.fromTo(linha, { xPercent: 0 }, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 })
    ));
    if (linhas.length) {
        const inclinar = gsap.quickTo(linhas, 'skewX', { duration: 0.4, ease: 'power3' });
        ScrollTrigger.create({
            trigger: '.faixa',
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                const velocidade = gsap.utils.clamp(-12, 12, self.getVelocity() / 180);
                inclinar(-velocidade);
                voltas.forEach((volta) => gsap.fromTo(volta, { timeScale: 1 + Math.abs(velocidade) }, { timeScale: 1, duration: 1.2, overwrite: true }));
                gsap.delayedCall(0.15, () => inclinar(0));
            }
        });
    }

    // ---------- Galerias ----------
    gsap.from('.cL, .cR', { y: 70, autoAlpha: 0, duration: 1.1, ease: 'power3.out', stagger: 0.15, clearProps: 'transform', scrollTrigger: { trigger: '.cards', start: 'top 85%' } });
    gsap.from('.cL-top .hb, .cR-bot .hb', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.inOut', scrollTrigger: { trigger: '.cards', start: 'top 80%' } });
    revelar($('#gal-t'));
    revelar($('#ft-t'));
    gsap.from('.evc', { x: -40, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, clearProps: 'transform', scrollTrigger: { trigger: '.evlist', start: 'top 90%' } });
    gsap.from('.photos .duo', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.1, ease: 'expo.out', stagger: 0.12, clearProps: 'clipPath', scrollTrigger: { trigger: '.photos', start: 'top 88%' } });
    gsap.fromTo('#ft-giant', { yPercent: 45 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.cR-bot', start: 'top bottom', end: 'bottom 70%', scrub: true } });

    // ---------- Como pegar ----------
    $$('.tl').forEach((linha) => {
        gsap.from(linha.querySelectorAll('span'), { scaleX: 0, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: linha, start: 'top 92%', end: 'top 60%', scrub: true } });
        gsap.from(linha.querySelectorAll('i'), { scale: 0, duration: 0.5, ease: 'back.out(3)', stagger: 0.12, scrollTrigger: { trigger: linha, start: 'top 90%' } });
    });
    revelar($('#how-t'), { stagger: 0.025 });
    gsap.from('.ocard', { y: 110, rotate: -3, autoAlpha: 0, duration: 1.1, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '.ocard', start: 'top 92%' } });
    gsap.from('.ocard li', { x: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.ocard ol', start: 'top 90%' } });
    gsap.from('.ocard .huge', { xPercent: -40, yPercent: 60, rotate: -45, autoAlpha: 0, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.ocard .huge', start: 'top 98%' } });
    gsap.from('.side-r .arrow', { x: -60, y: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.side-r .arrow', start: 'top 92%' } });
    gsap.from('.dots', { autoAlpha: 0, duration: 1.2, stagger: 0.1, scrollTrigger: { trigger: '.how', start: 'top 70%' } });
    const sync = $('#sync');
    revelar(sync, { stagger: 0.05, scrollTrigger: { trigger: sync, start: 'top 98%' } });
    gsap.fromTo(sync, { xPercent: 4 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.how', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.rodape-hb', { scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.rodape', start: 'top 98%' } });

    // ---------- Botoes magneticos e cursor (so com mouse) ----------
    if (mouse) {
        document.querySelectorAll('[data-magnetico]').forEach((el) => {
            const moverX = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            const moverY = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            el.addEventListener('pointermove', (event) => {
                const caixa = el.getBoundingClientRect();
                moverX((event.clientX - (caixa.left + caixa.width / 2)) * 0.35);
                moverY((event.clientY - (caixa.top + caixa.height / 2)) * 0.35);
            });
            el.addEventListener('pointerleave', () => {
                moverX(0);
                moverY(0);
            });
        });

        const anel = $('.cursor-anel');
        if (anel) {
            const rotulo = anel.querySelector('span');
            const anelX = gsap.quickTo(anel, 'x', { duration: 0.45, ease: 'power3' });
            const anelY = gsap.quickTo(anel, 'y', { duration: 0.45, ease: 'power3' });
            window.addEventListener('pointermove', (event) => {
                gsap.to(anel, { opacity: 1, duration: 0.2, overwrite: 'auto' });
                anelX(event.clientX);
                anelY(event.clientY);
            }, { passive: true });
            document.addEventListener('pointerover', (event) => {
                const alvo = event.target.closest('a, button, [data-cursor]');
                const comRotulo = alvo?.closest('[data-cursor]');
                anel.classList.toggle('ativo', Boolean(comRotulo));
                rotulo.textContent = comRotulo?.dataset.cursor || '';
                gsap.to(anel, { scale: alvo && !comRotulo ? 1.5 : 1, duration: 0.3 });
            });
            document.documentElement.addEventListener('pointerleave', () => gsap.to(anel, { opacity: 0, duration: 0.2 }));
        }

        // O codigo do evento embaralha quando o mouse passa no painel
        const codigo = $('#pd-code');
        const original = codigo?.textContent || '';
        $('#pd')?.addEventListener('pointerenter', () => {
            if (!original) return;
            const sinais = 'ABCDEFGHJKLMNPRSTUVWXZ0123456789';
            let quadro = 0;
            const id = setInterval(() => {
                quadro += 1;
                codigo.textContent = [...original].map((c, i) => (quadro > 4 + i * 3 ? c : sinais[Math.floor(Math.random() * sinais.length)])).join('');
                if (quadro > 4 + original.length * 3) {
                    clearInterval(id);
                    codigo.textContent = original;
                }
            }, 40);
        });
    }

    // =====================================================================
    // EASTER EGGS
    //  1. Clica 5 vezes na estrela: arrancada (com ronco do motor).
    //  2. Digita "drift" (ou toca 3 vezes na faixa laranja): marca de pneu
    //     segue o mouse ou o dedo.
    //  3. Codigo Konami (↑↑↓↓←→←→BA): troca as cores do site.
    //  4. Clica 3 vezes no letreiro gigante: as letras batem e voltam pro box.
    // =====================================================================
    const aviso = $('#aviso');
    let avisoTempo = null;
    const avisar = (texto) => {
        if (!aviso) return;
        aviso.innerHTML = texto;
        aviso.classList.add('on');
        clearTimeout(avisoTempo);
        avisoTempo = setTimeout(() => aviso.classList.remove('on'), 2800);
    };

    // Toques rapidos seguidos no mesmo elemento
    const toques = (el, quantos, acao, aoTocar) => {
        if (!el) return;
        let n = 0;
        let zerar = null;
        el.addEventListener('click', () => {
            n += 1;
            clearTimeout(zerar);
            zerar = setTimeout(() => {
                n = 0;
                aoTocar?.(0);
            }, 1600);
            aoTocar?.(n);
            if (n >= quantos) {
                n = 0;
                acao();
            }
        });
    };

    // Fumaca de pneu
    const fumaca = (x, y, tamanho = 60) => {
        const puff = document.createElement('span');
        puff.setAttribute('aria-hidden', 'true');
        Object.assign(puff.style, {
            position: 'fixed', left: `${x}px`, top: `${y}px`, width: `${tamanho}px`, height: `${tamanho}px`,
            margin: `${-tamanho / 2}px 0 0 ${-tamanho / 2}px`, borderRadius: '50%', pointerEvents: 'none', zIndex: 85,
            background: 'radial-gradient(circle, rgba(246,245,242,.85) 0%, rgba(246,245,242,.35) 45%, rgba(246,245,242,0) 70%)'
        });
        document.body.appendChild(puff);
        gsap.fromTo(puff, { scale: 0.3, opacity: 0.9 }, {
            scale: 2.6 + Math.random(), opacity: 0, x: (Math.random() - 0.5) * 80, y: -40 - Math.random() * 60,
            duration: 1.3 + Math.random() * 0.6, ease: 'power2.out', onComplete: () => puff.remove()
        });
    };

    // Ronco do motor: duas ondas serrilhadas, duas aceleradas e os estalos do escapamento
    let audio = null;
    const ronco = () => {
        try {
            const A = window.AudioContext || window.webkitAudioContext;
            if (!A) return;
            audio = audio || new A();
            if (audio.state === 'suspended') audio.resume();
            const t = audio.currentTime;
            const volume = audio.createGain();
            volume.gain.setValueAtTime(0.0001, t);
            volume.gain.exponentialRampToValueAtTime(0.14, t + 0.08);
            volume.gain.setValueAtTime(0.14, t + 1.5);
            volume.gain.exponentialRampToValueAtTime(0.0001, t + 2.1);
            const filtro = audio.createBiquadFilter();
            filtro.type = 'lowpass';
            filtro.frequency.setValueAtTime(450, t);
            filtro.frequency.linearRampToValueAtTime(1500, t + 1.3);
            filtro.connect(volume).connect(audio.destination);
            [0, 9].forEach((desafino) => {
                const motor = audio.createOscillator();
                motor.type = 'sawtooth';
                motor.detune.value = desafino;
                motor.frequency.setValueAtTime(46, t);
                motor.frequency.exponentialRampToValueAtTime(140, t + 0.35);
                motor.frequency.exponentialRampToValueAtTime(70, t + 0.62);
                motor.frequency.exponentialRampToValueAtTime(190, t + 1.25);
                motor.frequency.exponentialRampToValueAtTime(58, t + 1.95);
                motor.connect(filtro);
                motor.start(t);
                motor.stop(t + 2.15);
            });
            [1.32, 1.44, 1.53, 1.7].forEach((quando) => {
                const n = Math.floor(audio.sampleRate * 0.035);
                const buffer = audio.createBuffer(1, n, audio.sampleRate);
                const dados = buffer.getChannelData(0);
                for (let i = 0; i < n; i += 1) dados[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 2;
                const estalo = audio.createBufferSource();
                const banda = audio.createBiquadFilter();
                const ganho = audio.createGain();
                estalo.buffer = buffer;
                banda.type = 'bandpass';
                banda.frequency.value = 900;
                ganho.gain.value = 0.4;
                estalo.connect(banda).connect(ganho).connect(audio.destination);
                estalo.start(t + quando);
            });
        } catch {
            // sem audio, a animacao segue sozinha
        }
    };

    // 1. Arrancada
    const estrela = $('.logo-botao svg');
    let arrancando = false;
    toques($('.logo-botao'), 5, () => {
        if (arrancando) return;
        arrancando = true;
        ronco();
        avisar('<b>✦</b> Arrancada liberada');
        const caixa = $('.pA').getBoundingClientRect();
        const tl = gsap.timeline({ onComplete: () => { arrancando = false; } });
        tl.to(estrela, { scale: 1, duration: 0.3 }, 0)
            .to('.name', { x: () => gsap.utils.random(-3, 3), y: () => gsap.utils.random(-2, 2), duration: 0.05, repeat: 22, yoyo: true, ease: 'none' }, 0)
            .call(() => {
                for (let i = 0; i < 6; i += 1) setTimeout(() => fumaca(caixa.left + 80 + Math.random() * 60, caixa.bottom - 40, 90), i * 90);
            }, null, 0.2)
            .set('.name', { x: 0, y: 0 }, 1.15)
            .to(nome, { x: () => window.innerWidth, skewX: -28, duration: 0.55, ease: 'power3.in', stagger: { each: 0.03, from: 'end' } }, 1.15)
            .set(nome, { x: () => -window.innerWidth }, 1.95)
            .to(nome, { x: 0, skewX: 0, duration: 0.9, ease: 'expo.out', stagger: 0.03 }, 2.05);
    }, (n) => {
        // cada toque gira uma ponta da estrela e ela cresce; parado, ela volta ao normal
        gsap.to(estrela, n ? { rotate: '+=72', scale: 1 + n * 0.08, duration: 0.6, ease: 'back.out(3)' } : { scale: 1, duration: 0.4 });
    });

    // 2. Modo drift: marcas de pneu e fumaca seguindo o mouse ou o dedo
    let drift = null;
    const modoDrift = () => {
        avisar('<b>✦</b> Modo drift · 15 s');
        if (drift) {
            drift.ate = performance.now() + 15000;
            return;
        }
        const tela = document.createElement('canvas');
        tela.className = 'pneus';
        tela.setAttribute('aria-hidden', 'true');
        document.body.appendChild(tela);
        const ctx = tela.getContext('2d');
        const medir = () => {
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            tela.width = window.innerWidth * dpr;
            tela.height = window.innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        medir();
        let ultimo = null;
        const rastro = (x, y) => {
            if (ultimo) {
                const dx = x - ultimo.x;
                const dy = y - ultimo.y;
                const d = Math.hypot(dx, dy);
                if (d < 3) return;
                const nx = (-dy / d) * 10;
                const ny = (dx / d) * 10;
                ctx.strokeStyle = 'rgba(11, 11, 12, 0.6)';
                ctx.lineWidth = 7;
                ctx.lineCap = 'round';
                [-1, 1].forEach((lado) => {
                    ctx.beginPath();
                    ctx.moveTo(ultimo.x + nx * lado, ultimo.y + ny * lado);
                    ctx.lineTo(x + nx * lado, y + ny * lado);
                    ctx.stroke();
                });
                if (d > 14 && Math.random() < 0.3) fumaca(x - dx * 2, y - dy * 2, 50);
            }
            ultimo = { x, y };
        };
        const aoMover = (event) => rastro(event.clientX, event.clientY);
        const aoTocar = (event) => {
            const dedo = event.touches[0];
            if (dedo) rastro(dedo.clientX, dedo.clientY);
        };
        const soltar = () => { ultimo = null; };
        window.addEventListener('pointermove', aoMover, { passive: true });
        window.addEventListener('touchmove', aoTocar, { passive: true });
        window.addEventListener('touchend', soltar);
        window.addEventListener('resize', medir);
        // a borracha vai sumindo aos poucos
        const apagar = setInterval(() => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, tela.width, tela.height);
            ctx.globalCompositeOperation = 'source-over';
            if (performance.now() > drift.ate) {
                clearInterval(apagar);
                window.removeEventListener('pointermove', aoMover);
                window.removeEventListener('touchmove', aoTocar);
                window.removeEventListener('touchend', soltar);
                window.removeEventListener('resize', medir);
                gsap.to(tela, { opacity: 0, duration: 0.6, onComplete: () => tela.remove() });
                drift = null;
            }
        }, 60);
        drift = { ate: performance.now() + 15000 };
    };
    let digitado = '';
    // 3. Konami
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konami = 0;
    window.addEventListener('keydown', (event) => {
        if (event.target.closest?.('input, textarea')) return;
        const tecla = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        digitado = (digitado + (tecla.length === 1 ? tecla : '')).slice(-5);
        if (digitado === 'drift') {
            digitado = '';
            modoDrift();
        }
        konami = tecla === KONAMI[konami] ? konami + 1 : (tecla === KONAMI[0] ? 1 : 0);
        if (konami === KONAMI.length) {
            konami = 0;
            const trocou = html.classList.toggle('troca');
            gsap.fromTo('body', { filter: 'invert(1)' }, { filter: 'invert(0)', duration: 0.5, ease: 'power2.out', clearProps: 'filter' });
            avisar(trocou ? '<b>✦</b> Cores trocadas · ↑↑↓↓←→←→BA' : '<b>✦</b> Cores de volta');
        }
    });
    toques($('.faixa'), 3, modoDrift);

    // 4. Batida: as letras do letreiro voam e voltam pro box
    let batendo = false;
    toques(sync, 3, () => {
        if (batendo) return;
        batendo = true;
        const ls = sync.querySelectorAll('.l');
        avisar('<b>✦</b> Volta pro box');
        gsap.timeline({ onComplete: () => { batendo = false; } })
            .to(ls, {
                x: () => gsap.utils.random(-260, 260),
                y: () => gsap.utils.random(-320, -60),
                rotate: () => gsap.utils.random(-120, 120),
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.02
            })
            .to(ls, { x: 0, y: 0, rotate: 0, duration: 1.1, ease: 'bounce.out', stagger: 0.03 }, '+=0.35');
    });

    // Recalcula as posicoes quando fontes e imagens terminam de carregar
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh());
})();

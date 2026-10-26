# imnotkiq

Site das galerias do [@imnotkiq](https://www.instagram.com/imnotkiq/): fotografia automotiva em Ribeirão Preto, SP.

## Adicionar um evento

Edita a lista em `assets/js/eventos.js`: nome, data, local, categoria, link da pasta do drive e as fotos. As fotos ficam na pasta `fotos/`. O evento mais novo vira o destaque do site.

## Estrutura

```
.
├── index.html
├── fotos/                 fotos dos eventos
└── assets/
    ├── css/site.css       layout e responsivo (funciona sem animação)
    └── js/
        ├── eventos.js     lista de eventos
        ├── site.js        monta a página a partir da lista
        ├── anima.js       animações e easter eggs
        └── vendor/        GSAP, ScrollTrigger e Lenis
```

Não tem build nem dependência: é HTML, CSS e JavaScript puros. Pra rodar no computador, qualquer servidor estático serve (`python3 -m http.server 8000`).

Quem pede menos movimento no sistema vê o site parado e completo, sem animação.

## Easter eggs

- Clicar 5 vezes na estrela do topo: arrancada, com ronco do motor.
- Digitar `drift` (ou tocar 3 vezes na faixa laranja): marca de pneu seguindo o mouse ou o dedo.
- Código Konami (↑ ↑ ↓ ↓ ← → ← → B A): troca o roxo pelo laranja.
- Clicar 3 vezes no letreiro gigante: as letras batem e voltam pro box.

## Publicar

Em **Settings → Pages**, escolhe a branch `main` e a pasta `/ (root)`. O site fica em https://okaiquemota.github.io/imnotkiq/

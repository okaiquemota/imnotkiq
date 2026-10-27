# imnotkiq

Site dos drives do [@imnotkiq](https://www.instagram.com/imnotkiq/): as fotos de cada evento, no Google Drive. Fotografia automotiva em Ribeirão Preto, SP.

Pôster suíço em blocos, no escuro: preto e cinzas, e o roxo marcando o que leva pro drive. O painel roxo do topo abre o drive do último evento; a seção **Drives** lista todos, um por linha, com o botão "Abrir drive".

## Adicionar um evento

Edita a lista em `assets/js/eventos.js`: nome, data, local, categoria, o link da pasta do drive e uma foto de capa (na pasta `fotos/`). O evento mais novo vira o destaque do topo.

O link do drive precisa estar em "Qualquer pessoa com o link → Leitor". Enquanto o `drive` estiver vazio, o site mostra "Fotos em breve".

## Estrutura

```
.
├── index.html
├── fotos/                 uma capa por evento
└── assets/
    ├── css/site.css       layout e responsivo (funciona sem animação)
    └── js/
        ├── eventos.js     lista de eventos (é aqui que você mexe)
        ├── site.js        monta a página a partir da lista
        ├── anima.js       animações e easter eggs
        └── vendor/        GSAP, ScrollTrigger e Lenis
```

Não tem build nem dependência: é HTML, CSS e JavaScript puros. Pra rodar no computador, qualquer servidor estático serve (`python3 -m http.server 8000`).

Quem pede menos movimento no sistema vê o site parado e completo, sem animação.

## Easter eggs

- Clicar 5 vezes na estrela do topo: arrancada, com ronco do motor.
- Digitar `drift` (ou tocar 3 vezes na faixa que corre): marca de pneu seguindo o mouse ou o dedo.
- Código Konami (↑ ↑ ↓ ↓ ← → ← → B A): o roxo vira laranja.
- Clicar 3 vezes no letreiro gigante: as letras batem e voltam pro box.

## Publicar

Em **Settings → Pages**, escolhe a branch `main` e a pasta `/ (root)`. O site fica em https://okaiquemota.github.io/imnotkiq/

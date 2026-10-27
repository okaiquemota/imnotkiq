# imnotkiq

Site dos drives do [@imnotkiq](https://www.instagram.com/imnotkiq/): as fotos de cada evento, no Google Drive.

Irmão do site pessoal ([kaique.v2](https://github.com/okaiquemota/kaique.v2)): o nome no topo, a capa do último evento no meio com a assinatura por cima e um link por evento embaixo, direto pro drive.

## Adicionar um evento

1. Põe uma foto do evento na pasta `fotos/` (em pé, 4:5). Ela entra em preto e branco sozinha.
2. Abre `assets/js/eventos.js` e adiciona o evento **no topo da lista**: nome, link da pasta do drive e a capa.

O primeiro da lista vira a foto do site. O link do drive precisa estar em "Qualquer pessoa com o link → Leitor"; enquanto o `drive` estiver vazio, o evento aparece em cinza com "em breve".

## Estrutura

```
.
├── index.html
├── fotos/                 uma capa por evento
└── assets/
    ├── css/site.css       visual e responsivo
    ├── img/               assinatura (png e svg)
    └── js/
        ├── eventos.js     lista de eventos (é aqui que você mexe)
        └── site.js        monta a capa e os links
```

Não tem build nem dependência: é HTML, CSS e JavaScript puros. Pra rodar no computador: `python3 -m http.server 8000`.

## Publicar

Em **Settings → Pages**, escolhe a branch `main` e a pasta `/ (root)`. O site fica em https://okaiquemota.github.io/imnotkiq/

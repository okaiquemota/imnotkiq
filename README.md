# imnotkiq

Site das galerias do [@imnotkiq](https://www.instagram.com/imnotkiq/): as fotos dos eventos, no Drive.

Escuro e direto: o último evento em destaque com o botão do Drive, uma seleção de fotos (clicar abre grande, com setas, teclado e arrastar no celular) e, quando tiver mais de um evento, a lista dos anteriores.

## Adicionar um evento

1. Põe as fotos na pasta `fotos/` (em pé, 4:5, 1080×1350 fica ótimo).
2. Abre `assets/js/eventos.js` e adiciona o evento **no topo da lista**: nome, data, local, categoria, link da pasta do Drive e as fotos. A primeira foto é a capa.
3. O primeiro da lista vira o destaque; os outros vão pra lista de eventos anteriores sozinhos.

O link do Drive precisa estar em "Qualquer pessoa com o link → Leitor". Enquanto o `drive` estiver vazio, o site mostra "Fotos em breve".

## Estrutura

```
.
├── index.html
├── fotos/                 fotos dos eventos
└── assets/
    ├── css/site.css       visual e responsivo
    └── js/
        ├── eventos.js     lista de eventos (é aqui que você mexe)
        └── site.js        monta a página a partir da lista
```

Não tem build nem dependência: é HTML, CSS e JavaScript puros. Pra rodar no computador: `python3 -m http.server 8000`.

## Publicar

Em **Settings → Pages**, escolhe a branch `main` e a pasta `/ (root)`. O site fica em https://okaiquemota.github.io/imnotkiq/

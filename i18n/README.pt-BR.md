<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/assets/mascot-dark.svg">
    <img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/assets/mascot.svg" width="150" alt="Hoot, o mascote do cookieowl: uma coruja de quepe de guarda segurando um cookie">
  </picture>
</p>

<h1 align="center">cookieowl</h1>

<p align="center">Um banner de consentimento de cookies pequeno, para a LGPD e o GDPR, que impede os rastreadores de rodar até o visitante concordar.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/cookieowl"><img src="https://img.shields.io/npm/v/cookieowl?color=f2b134&label=npm" alt="Versão no npm"></a>
  <a href="https://github.com/kwy404/cookieowl/actions/workflows/ci.yml"><img src="https://github.com/kwy404/cookieowl/actions/workflows/ci.yml/badge.svg" alt="Status do CI"></a>
  <a href="https://github.com/kwy404/cookieowl/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/cookieowl?color=1b2547" alt="Licença MIT"></a>
</p>

<p align="center">
  <a href="https://kwy404.github.io/cookieowl/#configurator">Gerador de banner</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/#demo">Demo ao vivo</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/guides.html">Guias</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/api.html">API</a> &middot;
  <a href="https://github.com/kwy404/cookieowl/blob/main/README.md">English</a>
</p>

A maioria dos banners de cookies só se esconde. O cookieowl impede o navegador de executar os scripts que você marcar até a categoria deles ser aceita, configura o Google Consent Mode v2 e deixa o visitante mudar de ideia depois. É um arquivo só, sem dependências e sem servidor, com licença MIT.

## Início rápido

O jeito mais fácil é o [gerador de banner](https://kwy404.github.io/cookieowl/#configurator): escolha uma região, uma cor e os seus textos, confira a prévia ao vivo e copie uma linha. À mão, fica assim:

```html
<head>
  <!-- Primeira coisa do head, sem async nem defer -->
  <script src="https://cdn.jsdelivr.net/npm/cookieowl@0.2.0/dist/cookieowl.js"
    data-preset="lgpd" data-policy-url="/privacidade"></script>

  <!-- O Google Analytics agora espera a categoria analytics -->
  <script type="text/plain" data-cookieowl="analytics" async
    src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
  <script type="text/plain" data-cookieowl="analytics">
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX');
  </script>
</head>
<body>
  <a href="#" data-cookieowl-open>Configurações de cookies</a>
</body>
```

O banner aparece na primeira visita, a escolha fica guardada por 12 meses e um pequeno botão de coruja reabre as preferências em todas as páginas.

### Presets

| Preset | O que define |
| --- | --- |
| `data-preset="lgpd"` | Textos em português, redação da LGPD, Consent Mode v2 e bloqueio automático |
| `data-preset="gdpr"` | O idioma do visitante, redação do GDPR, Consent Mode v2 e bloqueio automático |

O que você definir por conta própria vale mais que o preset: `data-preset="lgpd" data-lang="en"` mantém a redação da LGPD em inglês.

### Cores e textos

```html
<script src="https://cdn.jsdelivr.net/npm/cookieowl@0.2.0/dist/cookieowl.js"
  data-preset="lgpd" data-accent="#2f6fed" data-layout="bar"
  data-text-title="Cookies neste site" data-text-accept-all="OK"></script>
```

`data-accent` aceita qualquer cor CSS. Todo texto embutido pode ser trocado com `data-text-*`, por exemplo `data-text-description` ou `data-text-reject-all`.

## npm

```bash
npm install cookieowl
```

```js
import { cookieowl } from 'cookieowl';

cookieowl.init({
  preset: 'lgpd',
  policyUrl: '/privacidade',
  onConsent(record) {
    navigator.sendBeacon('/api/consent-log', JSON.stringify(record));
  },
});

if (cookieowl.accepted('analytics')) startAnalytics();
cookieowl.on('change', ({ accepted }) => console.log('permitido agora:', accepted));
```

`cookieowl/react` traz `useConsent()` e `ConsentGate`, e `cookieowl/vue` traz um plugin com os mesmos recursos. Quando a tag de script já criou `window.cookieowl`, o import do npm devolve essa mesma instância. Importar no servidor é seguro.

## Como o bloqueio funciona

Todo elemento com `data-cookieowl` espera as suas categorias:

```html
<script type="text/plain" data-cookieowl="analytics" src="/js/stats.js"></script>
<iframe data-cookieowl="marketing" data-cookieowl-src="https://www.youtube-nocookie.com/embed/ID"></iframe>
```

O navegador não executa `text/plain`, então nada é requisitado. Quando a categoria é aceita, os scripts rodam na ordem do documento e os iframes bloqueados carregam. Até lá, os iframes mostram um aviso que permite carregar o conteúdo uma vez ou liberar a categoria.

Com `data-auto-block`, o cookieowl também segura rastreadores conhecidos pela URL quando outro script os injeta: Google Analytics, Tag Manager, Google Ads, Meta Pixel, Microsoft Clarity, Hotjar, LinkedIn Insight, TikTok Pixel, YouTube e Vimeo. Ele só consegue parar o que roda depois dele, então carregue-o primeiro.

## Google Consent Mode v2

Com `data-consent-mode`, o cookieowl envia `gtag('consent', 'default', ...)` com tudo negado, menos `security_storage`, antes de qualquer tag do Google, e depois um `consent update` a cada escolha e a cada nova visita. `data-consent-mode="advanced"` deixa as tags do Google carregarem antes do consentimento e enviarem pings sem cookies.

## O que fica guardado

Um cookie próprio chamado `cookieowl` com um id aleatório, a versão da sua política, a data, a validade, o método (`accept-all`, `reject-all`, `custom` ou `signal`) e as categorias. Passe `onConsent(record)` para manter o seu próprio registro. Mude `version` para perguntar de novo a todos.

Quando o navegador envia Global Privacy Control, o cookieowl registra a recusa das categorias opcionais e não mostra o banner; o visitante ainda pode aceitar nas preferências.

## Idiomas

Português (Brasil), inglês, espanhol, francês e alemão. `lang: 'auto'` lê `<html lang>` e depois o navegador.

## O que o cookieowl não faz

- Não varre o seu site em busca de cookies.
- Não guarda o consentimento num servidor.
- Não implementa o IAB Transparency and Consent Framework.
- Não é aconselhamento jurídico. Ele cuida da parte técnica; a política de privacidade e a revisão jurídica continuam com você.

## Guias (em inglês)

- [Cookie consent checklist](https://kwy404.github.io/cookieowl/lgpd-gdpr-cookie-checklist.html)
- [Setting up Google Consent Mode v2](https://kwy404.github.io/cookieowl/google-consent-mode-v2-setup.html)
- [Holding Google Analytics until consent](https://kwy404.github.io/cookieowl/block-google-analytics-until-consent.html)
- [Using cookieowl with React](https://kwy404.github.io/cookieowl/cookie-consent-in-react.html)

## Autor

Feito por **Alexandre Kohler** ([GitHub](https://github.com/kwy404), [LinkedIn](https://www.linkedin.com/in/alexandre-silva-173687256/)). O [site da documentação](https://kwy404.github.io/cookieowl/) é feito com [Monsoon](https://kwy404.github.io/monsoon/), e as partes interativas com [Voodoo.js](https://kwy404.github.io/Voodoo.js/).

## Licença

[MIT](https://github.com/kwy404/cookieowl/blob/main/LICENSE) 2026 Alexandre Kohler

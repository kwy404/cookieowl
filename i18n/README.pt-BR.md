<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/assets/mascot-dark.svg">
    <img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/assets/mascot.svg" width="168" alt="Hoot, o mascote do cookieowl: uma coruja simpática de quepe de segurança segurando um cookie, o rosto de um banner de cookies gratuito para LGPD e GDPR">
  </picture>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/scenes/readme-banner-dark.svg">
    <img src="https://cdn.jsdelivr.net/gh/kwy404/cookieowl@main/docs/assets/art/scenes/readme-banner-light.svg" width="820" alt="Banner do cookieowl: consentimento de cookies para LGPD e GDPR que bloqueia rastreadores de verdade até o visitante aceitar">
  </picture>
</p>

<h1 align="center">cookieowl: banner de cookies gratuito para LGPD e GDPR que bloqueia rastreadores de verdade</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/cookieowl"><img src="https://img.shields.io/npm/v/cookieowl?color=f2b134&label=npm" alt="Versão do cookieowl no npm"></a>
  <a href="https://www.npmjs.com/package/cookieowl"><img src="https://img.shields.io/npm/dm/cookieowl?color=1b2547" alt="Downloads mensais do cookieowl no npm"></a>
  <a href="https://www.npmjs.com/package/cookieowl"><img src="https://img.shields.io/npm/dt/cookieowl?color=1b2547" alt="Downloads totais do cookieowl no npm"></a>
  <a href="https://github.com/kwy404/cookieowl/actions/workflows/ci.yml"><img src="https://github.com/kwy404/cookieowl/actions/workflows/ci.yml/badge.svg" alt="Status da integração contínua do cookieowl"></a>
  <a href="https://github.com/kwy404/cookieowl/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/cookieowl?color=f2b134" alt="Licença MIT"></a>
  <a href="https://github.com/kwy404/cookieowl/blob/main/scripts/size.mjs"><img src="https://img.shields.io/badge/gzip-14.9%20kB-f2b134" alt="O script tem 14.9 kB com gzip"></a>
</p>

<p align="center">
  <a href="https://kwy404.github.io/cookieowl/">Documentação</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/#demo">Demo ao vivo</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/#configurator">Gerador de snippet</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/lgpd-gdpr-cookie-checklist.html">Checklist LGPD e GDPR</a> &middot;
  <a href="https://kwy404.github.io/cookieowl/api.html">API</a> &middot;
  <a href="https://github.com/kwy404/cookieowl/blob/main/README.md">Read in English</a>
</p>

**O cookieowl é um gerenciador de consentimento de cookies gratuito e de código aberto para a LGPD e o GDPR.** Com uma tag de script, os scripts de rastreamento ficam adormecidos até o visitante aceitar a categoria deles: Google Analytics, Tag Manager, Meta Pixel, Hotjar e vídeos do YouTube não carregam, não gravam cookies e não enviam nada antes da escolha. Ele configura o Google Consent Mode v2, mostra um banner acessível em cinco idiomas com Rejeitar tão visível quanto Aceitar, guarda um registro de consentimento versionado e permite revogar tão facilmente quanto consentir. Um arquivo, sem dependências, 14.9 kB com gzip.

```html
<script src="https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js"
  data-lang="pt-BR" data-policy-url="/privacidade" data-consent-mode data-auto-block></script>
```

## Sumário

- [Início rápido](#início-rápido)
- [Instalar pelo npm](#instalar-pelo-npm)
- [React, Next.js, Vue, Angular e WordPress](#react-nextjs-vue-angular-e-wordpress)
- [Bloquear scripts e vídeos até o consentimento](#bloquear-scripts-e-vídeos-até-o-consentimento)
- [Modo automático para rastreadores conhecidos](#modo-automático-para-rastreadores-conhecidos)
- [Google Consent Mode v2](#google-consent-mode-v2)
- [Categorias, serviços e cookies](#categorias-serviços-e-cookies)
- [O registro de consentimento](#o-registro-de-consentimento)
- [Revogação, validade e versões da política](#revogação-validade-e-versões-da-política)
- [Global Privacy Control e Do Not Track](#global-privacy-control-e-do-not-track)
- [Banner, temas e modo escuro](#banner-temas-e-modo-escuro)
- [Idiomas e textos da LGPD e do GDPR](#idiomas-e-textos-da-lgpd-e-do-gdpr)
- [API](#api)
- [Navegadores e tamanho](#navegadores-e-tamanho)
- [O que o cookieowl não faz](#o-que-o-cookieowl-não-faz)
- [Perguntas frequentes](#perguntas-frequentes)
- [Guias](#guias)
- [Mais projetos de kwy404](#mais-projetos-de-kwy404)
- [Autor](#autor)
- [Licença](#licença)

## Início rápido

Coloque a tag **em primeiro lugar** no `<head>`, **sem** `async` nem `defer`. Ela precisa rodar antes de qualquer rastreador para bloqueá-lo e para definir os padrões do Consent Mode.

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js"
    data-lang="pt-BR"
    data-policy-url="/politica-de-privacidade"
    data-consent-mode
    data-auto-block></script>

  <!-- O Google Analytics espera a categoria de estatísticas -->
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
  <a href="#" data-cookieowl-open>Configurar cookies</a>
</body>
</html>
```

É só isso. O banner aparece na primeira visita, a escolha fica guardada por 12 meses e um pequeno botão de coruja reabre as preferências em todas as páginas. Teste todas as opções no [gerador de snippet](https://kwy404.github.io/cookieowl/#configurator) e veja a [demo ao vivo](https://kwy404.github.io/cookieowl/#demo) segurar e liberar rastreadores falsos num monitor de rede.

## Instalar pelo npm

```bash
npm install cookieowl
```

```js
import { cookieowl } from 'cookieowl';

cookieowl.init({
  lang: 'pt-BR',
  policyUrl: '/politica-de-privacidade',
  version: '2026-10',
  consentMode: true,
  autoBlock: true,
  onConsent(record) {
    navigator.sendBeacon('/api/registro-de-consentimento', JSON.stringify(record));
  },
});

if (cookieowl.accepted('analytics')) iniciarEstatisticas();
cookieowl.on('change', ({ accepted }) => console.log('permitido agora:', accepted));
```

| Import | O que é |
| --- | --- |
| `cookieowl` | A instância compartilhada `cookieowl`, `createCookieOwl()`, `TRACKERS`, `LANGS` e os tipos. ES module e CommonJS. |
| `cookieowl/react` | `useConsent()`, `ConsentGate` e `useCookieOwl()` para React 16.8 ou mais novo. |
| `cookieowl/vue` | `CookieOwlPlugin`, `useConsent()` e `ConsentGate` para Vue 3. |
| `cookieowl/browser` | O build para tag de script, `dist/cookieowl.js` (global `cookieowl`). |

Quando a tag de script já criou `window.cookieowl`, o import do npm devolve essa mesma instância, então os helpers de React e Vue enxergam a escolha que ela gerencia. Importar no servidor é seguro: sem DOM, `init()` só guarda a configuração.

## React, Next.js, Vue, Angular e WordPress

**React.** Inicie o cookieowl antes de renderizar (ou use a tag no `index.html`) e proteja o que depende de consentimento:

```tsx
import { cookieowl } from 'cookieowl';
import { ConsentGate } from 'cookieowl/react';

cookieowl.init({ lang: 'pt-BR', policyUrl: '/privacidade', consentMode: true });

export function Video() {
  return (
    <ConsentGate category="marketing" fallback={<button onClick={() => cookieowl.showPreferences()}>Permitir vídeos</button>}>
      <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Tour do produto" />
    </ConsentGate>
  );
}
```

**Next.js.** Carregue o script com `beforeInteractive` no layout raiz:

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Script src="https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js"
          strategy="beforeInteractive" data-policy-url="/privacidade" data-consent-mode="" data-auto-block="" />
      </body>
    </html>
  );
}
```

**Vue 3.**

```js
import { createApp } from 'vue';
import { CookieOwlPlugin } from 'cookieowl/vue';
import App from './App.vue';

createApp(App).use(CookieOwlPlugin, { lang: 'pt-BR', consentMode: true }).mount('#app');
```

**Angular.** Chame `cookieowl.init()` no `src/main.ts` antes de `bootstrapApplication()`, ou adicione a tag ao `src/index.html`.

**WordPress.** Imprima a tag no início do `wp_head`, num plugin must use ou no tema filho:

```php
add_action('wp_head', function () {
    $policy = esc_url(get_privacy_policy_url());
    echo '<script src="https://cdn.jsdelivr.net/npm/cookieowl@0.1.0/dist/cookieowl.js"'
        . ' data-policy-url="' . $policy . '" data-consent-mode data-auto-block></script>';
}, 1);
```

## Bloquear scripts e vídeos até o consentimento

Qualquer elemento com `data-cookieowl` espera as suas categorias. Liste várias (`data-cookieowl="analytics marketing"`) para exigir todas.

```html
<!-- Inerte até aceitar estatísticas: navegadores não executam text/plain -->
<script type="text/plain" data-cookieowl="analytics" src="/js/estatisticas.js"></script>

<!-- Iframes e imagens: a URL espera em data-cookieowl-src -->
<iframe data-cookieowl="marketing" data-cookieowl-name="Google Maps"
  data-cookieowl-src="https://www.google.com/maps/embed?pb=..." width="600" height="400"></iframe>
```

Quando uma categoria é aceita, os scripts rodam **na ordem do documento**: cada script externo sem `async` termina de carregar antes do próximo. Iframes bloqueados mostram um aviso com **Carregar desta vez** e **Permitir cookies de marketing**. Elementos adicionados depois (aplicações de página única) são detectados sozinhos.

## Modo automático para rastreadores conhecidos

Com `data-auto-block`, o cookieowl reconhece as URLs de Google Analytics, Google Tag Manager, Google Ads, Meta Pixel, Microsoft Clarity, Hotjar, LinkedIn Insight Tag, TikTok Pixel e vídeos do YouTube e do Vimeo, e os segura mesmo quando outro script os injeta (por um `MutationObserver` e um gancho em `document.createElement`). **Carregue o cookieowl primeiro, de forma síncrona, no head**: ele não consegue parar um rastreador que já rodou. O preload scanner do navegador ainda pode baixar, mas nunca executar, um rastreador escrito direto no HTML; a marcação `text/plain` explícita evita até esse download.

```js
cookieowl.init({
  autoBlock: {
    patterns: [{ id: 'chat', name: 'Chat de suporte', category: 'preferences', match: /widget\.chat\.example/ }],
    categories: { gtm: 'marketing' },
    ignore: ['hotjar'],
  },
});
```

## Google Consent Mode v2

Com `data-consent-mode`, o cookieowl envia antes de qualquer tag do Google os padrões `ad_storage`, `ad_user_data`, `ad_personalization` e `analytics_storage` negados, com `wait_for_update`, e um `consent update` a cada escolha (e a cada visita de retorno). Os três sinais de anúncios seguem **marketing**, `analytics_storage` segue **estatísticas**, `functionality_storage` e `personalization_storage` seguem **preferências** e `security_storage` é sempre concedido. Um evento `cookieowl_consent` vai para o dataLayer para gatilhos do Tag Manager. Há suporte a padrões por região, `url_passthrough`, `ads_data_redaction` e ao modo avançado (`data-consent-mode="advanced"`).

## Categorias, serviços e cookies

As categorias padrão são `necessary` (sempre ativa), `preferences`, `analytics` e `marketing`, com nomes traduzidos. Adicione as suas e descreva os serviços de cada uma; o diálogo de preferências lista tudo e os cookies declarados são apagados na revogação.

```js
cookieowl.init({
  categories: [
    'preferences',
    {
      id: 'analytics',
      services: [{
        name: 'Google Analytics 4',
        provider: 'Google',
        policyUrl: 'https://policies.google.com/privacy',
        cookies: [{ name: '_ga', duration: '2 anos', description: 'Distingue visitantes' }],
      }],
    },
    'marketing',
  ],
});
```

## O registro de consentimento

A escolha fica num cookie primário chamado `cookieowl` (ou no localStorage) com um id aleatório, a versão da política, a data, a validade, o método (`accept-all`, `reject-all`, `custom` ou `signal`), as categorias, o idioma e a página. Passe `onConsent(record)` para guardar cada registro no seu próprio log de auditoria; o cookieowl não tem servidor e não envia nada a lugar nenhum.

## Revogação, validade e versões da política

- **Revogar a qualquer momento:** o botão flutuante de coruja e qualquer elemento com `data-cookieowl-open` abrem as preferências, como pede o art. 8º, § 5º da LGPD.
- **A revogação para os rastreadores:** os cookies das categorias revogadas são apagados e, se scripts delas já rodaram, a página recarrega.
- **Validade:** as escolhas expiram após `expiresDays` (365 por padrão).
- **Versões:** mude `version` quando fornecedores ou finalidades mudarem e todos verão o banner de novo.

## Global Privacy Control e Do Not Track

Quando o navegador envia o Global Privacy Control, o cookieowl registra a recusa das categorias opcionais, não mostra o banner e explica o sinal nas preferências, onde o visitante ainda pode aceitar. Desligue com `respectGPC: false`. O Do Not Track é respeitado com `respectDNT: true`.

## Banner, temas e modo escuro

Layouts `box`, `bar` e `modal`; Rejeitar todos e Aceitar todos com o mesmo estilo; nenhuma caixa pré-marcada; diálogos acessíveis com foco preso, Escape e anúncio para leitores de tela. O tema `auto` segue `data-theme` ou a classe `.dark` da página e depois o sistema. A cor de destaque é a sua variável `--seed` (âmbar por padrão), a mesma que dá tema ao [Monsoon](https://kwy404.github.io/monsoon/), mas o cookieowl traz a própria folha de estilo isolada e não depende de nada na página.

## Idiomas e textos da LGPD e do GDPR

| Código | Idioma | Texto padrão |
| --- | --- | --- |
| `pt-BR` | Português (Brasil) | LGPD (Lei 13.709/2018) |
| `en` | English | GDPR e ePrivacy |
| `es` | Español | RGPD |
| `fr` | Français | RGPD |
| `de` | Deutsch | DSGVO e TDDDG |

`lang: 'auto'` lê o `<html lang>` e depois os idiomas do navegador. `template: 'lgpd' | 'gdpr'` troca o texto legal em qualquer idioma, e todo texto pode ser sobrescrito com `text`. O layout usa propriedades lógicas de CSS e segue `<html dir>`, então funciona da direita para a esquerda.

## API

Opções principais: `categories`, `lang`, `template`, `policyUrl`, `version`, `expiresDays`, `storage`, `cookie`, `layout`, `position`, `theme`, `dir`, `reopenButton`, `container`, `text`, `consentMode`, `autoBlock`, `respectGPC`, `respectDNT`, `clearCookies`, `reloadOnWithdraw`, `autoShow` e `onConsent`.

Métodos: `init(config)`, `accepted(categoria)`, `acceptAll()`, `rejectAll()`, `save(escolhas)`, `getConsent()`, `categories()`, `show()`, `hide()`, `showPreferences()`, `hidePreferences()`, `reset()`, `on(evento, fn)`, `off(evento, fn)`, `destroy()` e `createCookieOwl(config)`.

Eventos: `change`, `consent`, `ready`, `show`, `hide` e `reset`, também disparados no `document` como `cookieowl:change` e assim por diante.

A referência completa, com tipos e valores padrão, está no [README em inglês](https://github.com/kwy404/cookieowl/blob/main/README.md#api) e na [página da API](https://kwy404.github.io/cookieowl/api.html).

## Navegadores e tamanho

Navegadores com ES2020: Chrome e Edge 80+, Firefox 74+, Safari 13.1+. O arquivo `dist/cookieowl.js` tem 40.7 kB minificado e 14.9 kB com gzip, com tudo incluído; o build falha se passar de 15 kB com gzip.

## O que o cookieowl não faz

- Não faz varredura de cookies no seu site; você declara os serviços e o modo automático conhece os rastreadores comuns.
- Não guarda consentimentos num servidor; use `onConsent` para manter o seu log.
- Não implementa o IAB TCF.
- Não é aconselhamento jurídico. Ele implementa a mecânica descrita pelas orientações da LGPD e do GDPR; a revisão legal é do seu jurídico.

## Perguntas frequentes

**Como bloquear o Google Analytics até o consentimento?**
Troque as duas partes do snippet para `type="text/plain"` com `data-cookieowl="analytics"`, ou ative `data-auto-block`. Veja o [guia](https://kwy404.github.io/cookieowl/block-google-analytics-until-consent.html).

**Existe um banner de cookies gratuito para a LGPD em português?**
Sim. `data-lang="pt-BR"` mostra o texto da LGPD, com Rejeitar todos e Aceitar todos lado a lado. Veja o [guia da LGPD](https://kwy404.github.io/cookieowl/cookie-consent-banner-lgpd.html).

**Como configurar o Google Consent Mode v2?**
Adicione `data-consent-mode`. Veja o [guia do Consent Mode](https://kwy404.github.io/cookieowl/google-consent-mode-v2-setup.html).

**O visitante pode mudar de ideia depois?**
Sim, pelo botão de coruja ou por qualquer link com `data-cookieowl-open`.

## Guias

- [Checklist interativo de LGPD e GDPR](https://kwy404.github.io/cookieowl/lgpd-gdpr-cookie-checklist.html)
- [Banner de cookies para a LGPD](https://kwy404.github.io/cookieowl/cookie-consent-banner-lgpd.html)
- [Banner de cookies em conformidade com o GDPR](https://kwy404.github.io/cookieowl/gdpr-compliant-cookie-banner.html)
- [Configurar o Google Consent Mode v2](https://kwy404.github.io/cookieowl/google-consent-mode-v2-setup.html)
- [Bloquear o Google Analytics até o consentimento](https://kwy404.github.io/cookieowl/block-google-analytics-until-consent.html)
- [Consentimento de cookies no React](https://kwy404.github.io/cookieowl/cookie-consent-in-react.html)
- [Consentimento de cookies no Next.js](https://kwy404.github.io/cookieowl/cookie-consent-in-nextjs.html)
- [Banner de cookies para WordPress](https://kwy404.github.io/cookieowl/cookie-banner-for-wordpress.html)
- [Script de consentimento de cookies gratuito](https://kwy404.github.io/cookieowl/free-cookie-consent-script.html)

## Mais projetos de kwy404

- [Monsoon](https://kwy404.github.io/monsoon/): CSS utilitário sem etapa de build e tema a partir de uma cor.
- [Voodoo.js](https://kwy404.github.io/Voodoo.js/): atributos reativos e JSX em HTML puro.
- [breakhound](https://kwy404.github.io/breakhound/): encontra bugs em bibliotecas JavaScript automaticamente.
- [vueleap](https://kwy404.github.io/vueleap/): migração de Vue 2 para Vue 3.
- [graphemely](https://kwy404.github.io/graphemely/): utilitários de texto que respeitam grafemas.
- [numberparrot](https://kwy404.github.io/numberparrot/): interpreta números localizados.
- [edgegoat](https://kwy404.github.io/edgegoat/): casos extremos para testes em JavaScript.
- [installkite](https://kwy404.github.io/installkite/): torna qualquer site instalável e com funcionamento offline.
- [a11ymedic](https://kwy404.github.io/a11ymedic/): verificador de acessibilidade que explica cada problema e entrega a correção exata.
- [fontsketch](https://kwy404.github.io/fontsketch/): transforma a sua letra em uma fonte, grátis e no navegador.
- [kastor](https://kwy404.github.io/kastor/): ORM para TypeScript para PostgreSQL, MySQL, SQLite, SQL Server, Oracle, MongoDB e mais.

## Autor

Criado por **Alexandre Kohler** ([GitHub](https://github.com/kwy404) e [LinkedIn](https://www.linkedin.com/in/alexandre-silva-173687256/)).

O [site da documentação](https://kwy404.github.io/cookieowl/) é feito com [Monsoon](https://kwy404.github.io/monsoon/), e as partes interativas com [Voodoo.js](https://kwy404.github.io/Voodoo.js/). A arte de livro ilustrado (Hoot, a cidade, os insetos rastreadores, 18 ilustrações e uma família de 57 ícones, cada um em versão de amanhecer e de noite) fica em [docs/assets/art](https://github.com/kwy404/cookieowl/tree/main/docs/assets/art), sob a licença MIT como o código.

## Licença

[MIT](https://github.com/kwy404/cookieowl/blob/main/LICENSE), 2026 Alexandre Kohler

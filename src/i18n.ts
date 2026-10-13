// Built in languages and the LGPD and GDPR wording. `{law}` in the two
// descriptions becomes the legal reference of the template, `{policy}` the link
// to policyUrl and `{name}` the name of a blocked embed.
import type { Texts } from './types';

export interface LangPack {
  t: Texts;
  /** [banner reference, preferences reference] per legal template. */
  lgpd: [string, string];
  gdpr: [string, string];
  /** [label, description] of the four built in categories. */
  cats: Record<'necessary' | 'preferences' | 'analytics' | 'marketing', [string, string]>;
}

const en: LangPack = {
  t: {
    title: 'We value your privacy',
    description: 'We use necessary cookies to run this site and, only with your consent, cookies for preferences, analytics and marketing{law}. You can accept, reject or choose by category.',
    prefsDescription: 'Choose the purposes you allow. You can withdraw consent at any time, as easily as you gave it{law}.',
    policySentence: 'Read our {policy}.',
    policyLink: 'privacy policy',
    acceptAll: 'Accept all',
    rejectAll: 'Reject all',
    customize: 'Customize',
    save: 'Save choices',
    close: 'Close',
    prefsTitle: 'Privacy preferences',
    alwaysOn: 'Always on',
    cookies: 'Cookies',
    duration: 'Duration',
    policy: 'Privacy policy',
    reopen: 'Cookie settings',
    saved: 'Your privacy choices were saved.',
    signal: 'Your browser sent a privacy signal, so optional cookies stay off.',
    embedTitle: '{name} content is blocked',
    embedText: 'It may set cookies. Load it once, or allow marketing cookies.',
    loadOnce: 'Load once',
    allowAlways: 'Allow marketing cookies',
  },
  lgpd: [', as required by the Brazilian LGPD (Law 13,709/2018)', ' (LGPD, art. 8, paragraph 5)'],
  gdpr: [', under the GDPR and the ePrivacy rules', ' (GDPR, Article 7(3))'],
  cats: {
    necessary: ['Necessary', 'Needed for the site to work, such as security and remembering these choices. Always on.'],
    preferences: ['Preferences', 'Remember settings such as language, region or theme.'],
    analytics: ['Analytics', 'Aggregated statistics on how the site is used.'],
    marketing: ['Marketing', 'Relevant ads, campaign measurement and embedded videos, also by third parties.'],
  },
};

const pt: LangPack = {
  t: {
    title: 'Sua privacidade importa',
    description: 'Usamos cookies necessários para o site funcionar e, somente com o seu consentimento, cookies de preferências, estatísticas e marketing{law}. Você pode aceitar, rejeitar ou escolher por categoria.',
    prefsDescription: 'Escolha as finalidades que você autoriza. Você pode revogar o consentimento a qualquer momento, de forma gratuita e tão fácil quanto concedeu{law}.',
    policySentence: 'Leia a nossa {policy}.',
    policyLink: 'política de privacidade',
    acceptAll: 'Aceitar todos',
    rejectAll: 'Rejeitar todos',
    customize: 'Personalizar',
    save: 'Salvar escolhas',
    close: 'Fechar',
    prefsTitle: 'Preferências de privacidade',
    alwaysOn: 'Sempre ativos',
    cookies: 'Cookies',
    duration: 'Duração',
    policy: 'Política de privacidade',
    reopen: 'Configurar cookies',
    saved: 'Suas escolhas de privacidade foram salvas.',
    signal: 'Seu navegador enviou um sinal de privacidade, então os cookies opcionais ficam desligados.',
    embedTitle: 'Conteúdo de {name} bloqueado',
    embedText: 'Ele pode gravar cookies. Carregue só desta vez ou permita cookies de marketing.',
    loadOnce: 'Carregar desta vez',
    allowAlways: 'Permitir cookies de marketing',
  },
  lgpd: [', conforme a Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018)', ' (art. 8º, § 5º da LGPD)'],
  gdpr: [', nos termos do RGPD e das regras de ePrivacy', ' (RGPD, artigo 7º, n.º 3)'],
  cats: {
    necessary: ['Necessários', 'Essenciais para o site funcionar, como segurança e lembrar destas escolhas. Sempre ativos.'],
    preferences: ['Preferências', 'Lembram configurações como idioma, região ou tema.'],
    analytics: ['Estatísticas', 'Dados agregados sobre como o site é usado.'],
    marketing: ['Marketing', 'Anúncios relevantes, medição de campanhas e vídeos incorporados, inclusive de terceiros.'],
  },
};

const es: LangPack = {
  t: {
    title: 'Respetamos tu privacidad',
    description: 'Usamos cookies necesarias para que el sitio funcione y, solo con tu consentimiento, cookies de preferencias, analítica y marketing{law}. Puedes aceptar, rechazar o elegir por categoría.',
    prefsDescription: 'Elige las finalidades que autorizas. Puedes retirar tu consentimiento en cualquier momento, tan fácilmente como lo diste{law}.',
    policySentence: 'Consulta nuestra {policy}.',
    policyLink: 'política de privacidad',
    acceptAll: 'Aceptar todas',
    rejectAll: 'Rechazar todas',
    customize: 'Personalizar',
    save: 'Guardar elección',
    close: 'Cerrar',
    prefsTitle: 'Preferencias de privacidad',
    alwaysOn: 'Siempre activas',
    cookies: 'Cookies',
    duration: 'Duración',
    policy: 'Política de privacidad',
    reopen: 'Configurar cookies',
    saved: 'Tus preferencias de privacidad se han guardado.',
    signal: 'Tu navegador envió una señal de privacidad, así que las cookies opcionales siguen desactivadas.',
    embedTitle: 'Contenido de {name} bloqueado',
    embedText: 'Puede instalar cookies. Cárgalo solo esta vez o permite las cookies de marketing.',
    loadOnce: 'Cargar esta vez',
    allowAlways: 'Permitir cookies de marketing',
  },
  lgpd: [', conforme a la ley brasileña de protección de datos (LGPD, Ley 13.709/2018)', ' (LGPD, art. 8, párrafo 5)'],
  gdpr: [', según el RGPD y las normas de ePrivacy', ' (RGPD, artículo 7.3)'],
  cats: {
    necessary: ['Necesarias', 'Imprescindibles para el sitio, como la seguridad y recordar esta elección. Siempre activas.'],
    preferences: ['Preferencias', 'Recuerdan ajustes como el idioma, la región o el tema.'],
    analytics: ['Analítica', 'Estadísticas agregadas sobre cómo se usa el sitio.'],
    marketing: ['Marketing', 'Anuncios relevantes, medición de campañas y vídeos incrustados, también de terceros.'],
  },
};

const fr: LangPack = {
  t: {
    title: 'Votre vie privée compte',
    description: 'Nous utilisons des cookies nécessaires au site et, uniquement avec votre consentement, des cookies de préférences, de mesure d’audience et marketing{law}. Vous pouvez accepter, refuser ou choisir par catégorie.',
    prefsDescription: 'Choisissez les finalités que vous autorisez. Vous pouvez retirer votre consentement à tout moment, aussi facilement que vous l’avez donné{law}.',
    policySentence: 'Consultez notre {policy}.',
    policyLink: 'politique de confidentialité',
    acceptAll: 'Tout accepter',
    rejectAll: 'Tout refuser',
    customize: 'Personnaliser',
    save: 'Enregistrer mes choix',
    close: 'Fermer',
    prefsTitle: 'Préférences de confidentialité',
    alwaysOn: 'Toujours actifs',
    cookies: 'Cookies',
    duration: 'Durée',
    policy: 'Politique de confidentialité',
    reopen: 'Paramètres des cookies',
    saved: 'Vos choix de confidentialité ont été enregistrés.',
    signal: 'Votre navigateur a envoyé un signal de confidentialité, les cookies facultatifs restent désactivés.',
    embedTitle: 'Contenu {name} bloqué',
    embedText: 'Il peut déposer des cookies. Chargez-le une fois ou autorisez les cookies marketing.',
    loadOnce: 'Charger une fois',
    allowAlways: 'Autoriser les cookies marketing',
  },
  lgpd: [', conformément à la loi brésilienne LGPD (loi 13.709/2018)', ' (LGPD, art. 8, paragraphe 5)'],
  gdpr: [', conformément au RGPD et aux règles ePrivacy', ' (RGPD, article 7, paragraphe 3)'],
  cats: {
    necessary: ['Nécessaires', 'Indispensables au site, par exemple pour la sécurité et la mémorisation de ces choix. Toujours actifs.'],
    preferences: ['Préférences', 'Mémorisent des réglages comme la langue, la région ou le thème.'],
    analytics: ['Mesure d’audience', 'Statistiques agrégées sur l’utilisation du site.'],
    marketing: ['Marketing', 'Publicités pertinentes, mesure des campagnes et vidéos intégrées, y compris par des tiers.'],
  },
};

const de: LangPack = {
  t: {
    title: 'Ihre Privatsphäre ist uns wichtig',
    description: 'Wir verwenden notwendige Cookies für den Betrieb der Website und, nur mit Ihrer Einwilligung, Cookies für Präferenzen, Statistik und Marketing{law}. Sie können alle akzeptieren, alle ablehnen oder nach Kategorie wählen.',
    prefsDescription: 'Wählen Sie die Zwecke, die Sie erlauben. Sie können Ihre Einwilligung jederzeit so einfach widerrufen, wie Sie sie erteilt haben{law}.',
    policySentence: 'Mehr in unserer {policy}.',
    policyLink: 'Datenschutzerklärung',
    acceptAll: 'Alle akzeptieren',
    rejectAll: 'Alle ablehnen',
    customize: 'Anpassen',
    save: 'Auswahl speichern',
    close: 'Schließen',
    prefsTitle: 'Datenschutz-Einstellungen',
    alwaysOn: 'Immer aktiv',
    cookies: 'Cookies',
    duration: 'Dauer',
    policy: 'Datenschutzerklärung',
    reopen: 'Cookie-Einstellungen',
    saved: 'Ihre Datenschutz-Auswahl wurde gespeichert.',
    signal: 'Ihr Browser hat ein Datenschutzsignal gesendet, optionale Cookies bleiben aus.',
    embedTitle: '{name}-Inhalt blockiert',
    embedText: 'Er kann Cookies setzen. Laden Sie ihn einmalig oder erlauben Sie Marketing-Cookies.',
    loadOnce: 'Einmal laden',
    allowAlways: 'Marketing-Cookies erlauben',
  },
  lgpd: [', gemäß dem brasilianischen Datenschutzgesetz (LGPD, Gesetz 13.709/2018)', ' (LGPD, Art. 8 Abs. 5)'],
  gdpr: [', gemäß DSGVO und TDDDG', ' (Art. 7 Abs. 3 DSGVO)'],
  cats: {
    necessary: ['Notwendig', 'Für den Betrieb nötig, etwa für Sicherheit und das Speichern dieser Auswahl. Immer aktiv.'],
    preferences: ['Präferenzen', 'Merken sich Einstellungen wie Sprache, Region oder Design.'],
    analytics: ['Statistik', 'Zusammengefasste Statistiken zur Nutzung der Website.'],
    marketing: ['Marketing', 'Relevante Werbung, Kampagnenmessung und eingebettete Videos, auch durch Dritte.'],
  },
};

export const LANGS: Record<string, LangPack> = { en, 'pt-BR': pt, es, fr, de };

/** Picks the closest built in language: `pt`, `pt-PT` and `pt-br` all map to `pt-BR`, `de-AT` to `de`. */
export function matchLang(wanted: string | undefined | null): string | null {
  if (!wanted) return null;
  const w = wanted.trim().toLowerCase().replace('_', '-');
  const codes = Object.keys(LANGS);
  return codes.find((c) => c.toLowerCase() === w) || codes.find((c) => c.toLowerCase().split('-')[0] === w.split('-')[0]) || null;
}

/** Resolves `auto` from `<html lang>`, then the browser languages, then English. */
export function detectLang(doc?: Document, nav?: Navigator): string {
  const fromDoc = matchLang(doc?.documentElement.getAttribute('lang'));
  if (fromDoc) return fromDoc;
  for (const l of nav?.languages || (nav?.language ? [nav.language] : [])) {
    const m = matchLang(l);
    if (m) return m;
  }
  return 'en';
}

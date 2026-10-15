// Built in languages and the LGPD and GDPR wording. `{law}` in the two
// descriptions becomes the legal reference of the template, `{policy}` the link
// to policyUrl and `{name}` the name of a blocked embed.
import type { TextKey, Texts } from './types';

export interface LangPack {
  t: Texts;
  /** [banner reference, preferences reference] per legal template. */
  lgpd: [string, string];
  gdpr: [string, string];
  /** [label, description] of the four built in categories. */
  cats: Record<'necessary' | 'preferences' | 'analytics' | 'marketing', [string, string]>;
}

// The packs are positional to keep the script tag build small: the texts in
// the order of TEXT_KEYS, the LGPD and GDPR references, then the label and
// description of necessary, preferences, analytics and marketing.
export const TEXT_KEYS = 'title description prefsDescription policySentence policyLink acceptAll rejectAll customize save close prefsTitle alwaysOn cookies duration policy reopen saved signal embedTitle embedText loadOnce allowAlways'.split(' ') as TextKey[];
const CATS = ['necessary', 'preferences', 'analytics', 'marketing'] as const;

function pack(t: string[], lgpd: [string, string], gdpr: [string, string], cats: string[]): LangPack {
  return {
    t: Object.fromEntries(TEXT_KEYS.map((k, i) => [k, t[i]])) as Texts,
    lgpd,
    gdpr,
    cats: Object.fromEntries(CATS.map((c, i) => [c, [cats[2 * i], cats[2 * i + 1]]])) as LangPack['cats'],
  };
}

const en = pack(
  [
    'We value your privacy', // title
    'We use necessary cookies to run this site and, only with your consent, cookies for preferences, analytics and marketing{law}. You can accept, reject or choose by category.', // description
    'Choose the purposes you allow. You can withdraw consent at any time, as easily as you gave it{law}.', // prefsDescription
    'Read our {policy}.', // policySentence
    'privacy policy', // policyLink
    'Accept all', // acceptAll
    'Reject all', // rejectAll
    'Customize', // customize
    'Save choices', // save
    'Close', // close
    'Privacy preferences', // prefsTitle
    'Always on', // alwaysOn
    'Cookies', // cookies
    'Duration', // duration
    'Privacy policy', // policy
    'Cookie settings', // reopen
    'Your privacy choices were saved.', // saved
    'Your browser sent a privacy signal, so optional cookies stay off.', // signal
    '{name} content is blocked', // embedTitle
    'It may set cookies. Load it once, or allow marketing cookies.', // embedText
    'Load once', // loadOnce
    'Allow marketing cookies', // allowAlways
  ],
  [', as required by the Brazilian LGPD (Law 13,709/2018)', ' (LGPD, art. 8, paragraph 5)'],
  [', under the GDPR and the ePrivacy rules', ' (GDPR, Article 7(3))'],
  [
    'Necessary', // necessary
    'Needed for the site to work, such as security and remembering these choices. Always on.',
    'Preferences', // preferences
    'Remember settings such as language, region or theme.',
    'Analytics', // analytics
    'Aggregated statistics on how the site is used.',
    'Marketing', // marketing
    'Relevant ads, campaign measurement and embedded videos, also by third parties.',
  ],
);

const pt = pack(
  [
    'Sua privacidade importa', // title
    'Usamos cookies necessários para o site funcionar e, somente com o seu consentimento, cookies de preferências, estatísticas e marketing{law}. Você pode aceitar, rejeitar ou escolher por categoria.', // description
    'Escolha as finalidades que você autoriza. Você pode revogar o consentimento a qualquer momento, de forma gratuita e tão fácil quanto concedeu{law}.', // prefsDescription
    'Leia a nossa {policy}.', // policySentence
    'política de privacidade', // policyLink
    'Aceitar todos', // acceptAll
    'Rejeitar todos', // rejectAll
    'Personalizar', // customize
    'Salvar escolhas', // save
    'Fechar', // close
    'Preferências de privacidade', // prefsTitle
    'Sempre ativos', // alwaysOn
    'Cookies', // cookies
    'Duração', // duration
    'Política de privacidade', // policy
    'Configurar cookies', // reopen
    'Suas escolhas de privacidade foram salvas.', // saved
    'Seu navegador enviou um sinal de privacidade, então os cookies opcionais ficam desligados.', // signal
    'Conteúdo de {name} bloqueado', // embedTitle
    'Ele pode gravar cookies. Carregue só desta vez ou permita cookies de marketing.', // embedText
    'Carregar desta vez', // loadOnce
    'Permitir cookies de marketing', // allowAlways
  ],
  [', conforme a Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018)', ' (art. 8º, § 5º da LGPD)'],
  [', nos termos do RGPD e das regras de ePrivacy', ' (RGPD, artigo 7º, n.º 3)'],
  [
    'Necessários', // necessary
    'Essenciais para o site funcionar, como segurança e lembrar destas escolhas. Sempre ativos.',
    'Preferências', // preferences
    'Lembram configurações como idioma, região ou tema.',
    'Estatísticas', // analytics
    'Dados agregados sobre como o site é usado.',
    'Marketing', // marketing
    'Anúncios relevantes, medição de campanhas e vídeos incorporados, inclusive de terceiros.',
  ],
);

const es = pack(
  [
    'Respetamos tu privacidad', // title
    'Usamos cookies necesarias para que el sitio funcione y, solo con tu consentimiento, cookies de preferencias, analítica y marketing{law}. Puedes aceptar, rechazar o elegir por categoría.', // description
    'Elige las finalidades que autorizas. Puedes retirar tu consentimiento en cualquier momento, tan fácilmente como lo diste{law}.', // prefsDescription
    'Consulta nuestra {policy}.', // policySentence
    'política de privacidad', // policyLink
    'Aceptar todas', // acceptAll
    'Rechazar todas', // rejectAll
    'Personalizar', // customize
    'Guardar elección', // save
    'Cerrar', // close
    'Preferencias de privacidad', // prefsTitle
    'Siempre activas', // alwaysOn
    'Cookies', // cookies
    'Duración', // duration
    'Política de privacidad', // policy
    'Configurar cookies', // reopen
    'Tus preferencias de privacidad se han guardado.', // saved
    'Tu navegador envió una señal de privacidad, así que las cookies opcionales siguen desactivadas.', // signal
    'Contenido de {name} bloqueado', // embedTitle
    'Puede instalar cookies. Cárgalo solo esta vez o permite las cookies de marketing.', // embedText
    'Cargar esta vez', // loadOnce
    'Permitir cookies de marketing', // allowAlways
  ],
  [', conforme a la ley brasileña de protección de datos (LGPD, Ley 13.709/2018)', ' (LGPD, art. 8, párrafo 5)'],
  [', según el RGPD y las normas de ePrivacy', ' (RGPD, artículo 7.3)'],
  [
    'Necesarias', // necessary
    'Imprescindibles para el sitio, como la seguridad y recordar esta elección. Siempre activas.',
    'Preferencias', // preferences
    'Recuerdan ajustes como el idioma, la región o el tema.',
    'Analítica', // analytics
    'Estadísticas agregadas sobre cómo se usa el sitio.',
    'Marketing', // marketing
    'Anuncios relevantes, medición de campañas y vídeos incrustados, también de terceros.',
  ],
);

const fr = pack(
  [
    'Votre vie privée compte', // title
    'Nous utilisons des cookies nécessaires au site et, uniquement avec votre consentement, des cookies de préférences, de mesure d’audience et marketing{law}. Vous pouvez accepter, refuser ou choisir par catégorie.', // description
    'Choisissez les finalités que vous autorisez. Vous pouvez retirer votre consentement à tout moment, aussi facilement que vous l’avez donné{law}.', // prefsDescription
    'Consultez notre {policy}.', // policySentence
    'politique de confidentialité', // policyLink
    'Tout accepter', // acceptAll
    'Tout refuser', // rejectAll
    'Personnaliser', // customize
    'Enregistrer mes choix', // save
    'Fermer', // close
    'Préférences de confidentialité', // prefsTitle
    'Toujours actifs', // alwaysOn
    'Cookies', // cookies
    'Durée', // duration
    'Politique de confidentialité', // policy
    'Paramètres des cookies', // reopen
    'Vos choix de confidentialité ont été enregistrés.', // saved
    'Votre navigateur a envoyé un signal de confidentialité, les cookies facultatifs restent désactivés.', // signal
    'Contenu {name} bloqué', // embedTitle
    'Il peut déposer des cookies. Chargez-le une fois ou autorisez les cookies marketing.', // embedText
    'Charger une fois', // loadOnce
    'Autoriser les cookies marketing', // allowAlways
  ],
  [', conformément à la loi brésilienne LGPD (loi 13.709/2018)', ' (LGPD, art. 8, paragraphe 5)'],
  [', conformément au RGPD et aux règles ePrivacy', ' (RGPD, article 7, paragraphe 3)'],
  [
    'Nécessaires', // necessary
    'Indispensables au site, par exemple pour la sécurité et la mémorisation de ces choix. Toujours actifs.',
    'Préférences', // preferences
    'Mémorisent des réglages comme la langue, la région ou le thème.',
    'Mesure d’audience', // analytics
    'Statistiques agrégées sur l’utilisation du site.',
    'Marketing', // marketing
    'Publicités pertinentes, mesure des campagnes et vidéos intégrées, y compris par des tiers.',
  ],
);

const de = pack(
  [
    'Ihre Privatsphäre ist uns wichtig', // title
    'Wir verwenden notwendige Cookies für den Betrieb der Website und, nur mit Ihrer Einwilligung, Cookies für Präferenzen, Statistik und Marketing{law}. Sie können alle akzeptieren, alle ablehnen oder nach Kategorie wählen.', // description
    'Wählen Sie die Zwecke, die Sie erlauben. Sie können Ihre Einwilligung jederzeit so einfach widerrufen, wie Sie sie erteilt haben{law}.', // prefsDescription
    'Mehr in unserer {policy}.', // policySentence
    'Datenschutzerklärung', // policyLink
    'Alle akzeptieren', // acceptAll
    'Alle ablehnen', // rejectAll
    'Anpassen', // customize
    'Auswahl speichern', // save
    'Schließen', // close
    'Datenschutz-Einstellungen', // prefsTitle
    'Immer aktiv', // alwaysOn
    'Cookies', // cookies
    'Dauer', // duration
    'Datenschutzerklärung', // policy
    'Cookie-Einstellungen', // reopen
    'Ihre Datenschutz-Auswahl wurde gespeichert.', // saved
    'Ihr Browser hat ein Datenschutzsignal gesendet, optionale Cookies bleiben aus.', // signal
    '{name}-Inhalt blockiert', // embedTitle
    'Er kann Cookies setzen. Laden Sie ihn einmalig oder erlauben Sie Marketing-Cookies.', // embedText
    'Einmal laden', // loadOnce
    'Marketing-Cookies erlauben', // allowAlways
  ],
  [', gemäß dem brasilianischen Datenschutzgesetz (LGPD, Gesetz 13.709/2018)', ' (LGPD, Art. 8 Abs. 5)'],
  [', gemäß DSGVO und TDDDG', ' (Art. 7 Abs. 3 DSGVO)'],
  [
    'Notwendig', // necessary
    'Für den Betrieb nötig, etwa für Sicherheit und das Speichern dieser Auswahl. Immer aktiv.',
    'Präferenzen', // preferences
    'Merken sich Einstellungen wie Sprache, Region oder Design.',
    'Statistik', // analytics
    'Zusammengefasste Statistiken zur Nutzung der Website.',
    'Marketing', // marketing
    'Relevante Werbung, Kampagnenmessung und eingebettete Videos, auch durch Dritte.',
  ],
);

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

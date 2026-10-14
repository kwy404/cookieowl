# Security policy

## Supported versions

| Version | Supported |
| --- | --- |
| 0.1.x | Yes |

## Reporting a vulnerability

Please do not open a public issue for security problems. Report them privately through [GitHub security advisories](https://github.com/kwy404/cookieowl/security/advisories/new). You will get an answer within a few days, and a fix will be released as soon as it is ready, with credit if you want it.

Relevant reports include, for example:

- a way for configured or stored text to inject markup or script into the page (the UI is built with DOM calls only and never renders text as HTML),
- a tracker that runs before consent although it is marked or covered by auto mode,
- a consent record that can be forged to grant categories the visitor did not accept, beyond what any first party cookie allows.

## Scope

cookieowl runs entirely in the visitor's browser and sends no data anywhere. Consent records are stored in a first party cookie or in localStorage on your own domain. If you send records to a server with `onConsent`, securing that endpoint is up to you.

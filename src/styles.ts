// The scoped stylesheet, injected once. Every rule lives under .cko, colors come
// from --cko-* tokens mixed for light or dark mode, the accent is the page
// --seed (amber when unset), so the UI needs nothing from the host page.
export const CSS = `.cko{--cko-mode:0;--cko-p:calc(var(--cko-mode)*100%);--cko-accent:var(--seed,#f2b134);--cko-bg:color-mix(in oklab,#141b31 var(--cko-p),#fcfdff);--cko-fg:color-mix(in oklab,#eef1fa var(--cko-p),#1b2240);--cko-muted:color-mix(in oklab,#a9b2cb var(--cko-p),#535d7d);--cko-line:color-mix(in oklab,#323c5a var(--cko-p),#d8ddea);--cko-soft:color-mix(in oklab,#1d2543 var(--cko-p),#f1f3f9);--cko-primary:var(--cko-accent);--cko-on-primary:#141a2e;--cko-ring:color-mix(in oklab,var(--cko-accent) 62%,var(--cko-fg));all:initial;display:contents;font:400 15px/1.5 var(--cko-font,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif);color:var(--cko-fg)}
@supports (color:oklch(from red l c h)){.cko{--cko-on-primary:oklch(from var(--cko-primary) clamp(.2,(.62 - l)*100000,1) min(c,.04) h)}}
@media (prefers-color-scheme:dark){.cko[data-cko-theme=auto]{--cko-mode:1}}
:is(.light,[data-theme=light]) .cko[data-cko-theme=auto]{--cko-mode:0}
:is(.dark,[data-theme=dark]) .cko[data-cko-theme=auto],.cko[data-cko-theme=dark]{--cko-mode:1}
.cko *,.cko ::before,.cko ::after{box-sizing:border-box;margin:0;padding:0;border:0;font:inherit;color:inherit;letter-spacing:normal;text-transform:none;text-align:start}
.cko [hidden]{display:none!important}
.cko-box,.cko-bar,.cko-modal,.cko-prefs,.cko-reopen{position:fixed;z-index:2147483000;background:var(--cko-bg);border:1px solid var(--cko-line);box-shadow:0 18px 48px -12px rgb(0 0 0/calc(.3 + .3*var(--cko-mode)))}
.cko-in .cko-box,.cko-in .cko-bar,.cko-in .cko-reopen,.cko-in .cko-veil{position:absolute}
.cko-bar{inset-inline:0;bottom:0;border-width:1px 0 0;padding:16px max(16px,50% - 560px)}
.cko-bar.cko-top{bottom:auto;top:0;border-width:0 0 1px}
.cko-bar .cko-in2{display:flex;flex-wrap:wrap;align-items:center;gap:12px 28px}
.cko-bar .cko-text{flex:1 1 420px}
.cko-box{bottom:16px;inset-inline-end:16px;width:min(420px,100% - 32px);padding:20px}
.cko-box.cko-bottom-left{inset-inline:16px auto}
.cko-box,.cko-modal,.cko-prefs{border-radius:14px}
.cko-veil{position:fixed;inset:0;z-index:2147483000;background:rgb(8 12 28/.55);display:grid;place-items:center;padding:16px}
.cko-veil>*{position:relative;width:min(520px,100%);padding:24px}
.cko-veil>.cko-prefs{width:min(640px,100%);max-height:min(720px,100%);padding:0;display:flex;flex-direction:column}
.cko-title{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:700;line-height:1.3;margin-bottom:6px}
.cko-title svg{flex:none;width:30px;height:30px}
.cko-text p,.cko-body p,.cko-embed p{color:var(--cko-muted);font-size:14px}
.cko a{text-decoration:underline;text-underline-offset:2px;cursor:pointer}
.cko-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;width:100%}
.cko-bar .cko-acts{margin:0;width:auto}
.cko-btn{flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 18px;border-radius:10px;font-weight:600;font-size:14px;line-height:1.2;cursor:pointer;background:var(--cko-primary);color:var(--cko-on-primary);border:1px solid transparent}
.cko-btn:hover{filter:brightness(1.06)}
.cko-ghost{background:0 0;color:var(--cko-fg);border-color:var(--cko-line)}
.cko-ghost:hover,.cko-x:hover{background:var(--cko-soft);color:var(--cko-fg)}
.cko :focus-visible{outline:2px solid var(--cko-ring);outline-offset:2px}
.cko-head,.cko-foot{display:flex;align-items:center;gap:12px;padding:16px 22px}
.cko-head{border-bottom:1px solid var(--cko-line)}
.cko-head .cko-title{flex:1;margin:0}
.cko-foot{border-top:1px solid var(--cko-line)}
.cko-foot .cko-acts{margin:0}
.cko-body{padding:18px 22px;overflow:auto;flex:1}
.cko-x{display:grid;place-items:center;width:36px;height:36px;border-radius:9px;cursor:pointer;color:var(--cko-muted)}
.cko-x svg,.cko-more svg{width:18px;height:18px;flex:none}
.cko-body .cko-note{background:var(--cko-soft);border-radius:10px;padding:10px 12px;margin-top:12px}
.cko-cats{list-style:none;margin-top:14px;border:1px solid var(--cko-line);border-radius:12px}
.cko-cat{padding:12px 14px}
.cko-cat+.cko-cat{border-top:1px solid var(--cko-line)}
.cko-row{display:flex;align-items:center;gap:12px}
.cko-more{flex:1;display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;padding:4px 0;border-radius:6px}
.cko-more svg{transition:transform .15s}
.cko-more[aria-expanded=true] svg{transform:rotate(180deg)}
.cko-always{font-size:12px;font-weight:600;color:var(--cko-muted)}
.cko-detail{padding:6px 0 4px;padding-inline-start:26px}
.cko-svc{margin-top:10px;border-radius:10px;background:var(--cko-soft);padding:10px 12px;font-size:13px}
.cko-svc b,.cko-svc th{font-weight:600}
.cko-svc table{width:100%;border-collapse:collapse;margin-top:6px}
.cko-svc th,.cko-svc td{padding:4px 0;padding-inline-end:8px;font-size:12px;vertical-align:top;border-top:1px solid var(--cko-line)}
.cko-sw{appearance:none;position:relative;flex:none;width:42px;height:24px;border-radius:99px;background:var(--cko-line);cursor:pointer;transition:background .15s}
.cko-sw::before{content:"";position:absolute;top:3px;inset-inline-start:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgb(0 0 0/.3);transition:inset-inline-start .15s}
.cko-sw:checked{background:var(--cko-primary)}
.cko-sw:checked::before{inset-inline-start:21px}
.cko-reopen{bottom:16px;inset-inline-start:16px;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;cursor:pointer}
.cko-reopen.cko-right{inset-inline:auto 16px}
.cko-reopen svg{width:28px;height:28px}
.cko-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.cko-embed{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;max-width:100%;padding:20px;border-radius:12px;border:1px dashed var(--cko-line);background:var(--cko-soft);color:var(--cko-fg)}
.cko-embed *{text-align:center}
.cko-embed strong{font-weight:700}
.cko-embed p{max-width:44ch}
.cko-embed .cko-acts{justify-content:center;margin:0}
.cko-embed .cko-btn{flex:0 1 auto}
@media (max-width:560px){.cko-acts{flex-direction:column}.cko-box{inset-inline:8px;bottom:8px;width:auto}}
@media (prefers-reduced-motion:no-preference){.cko-box,.cko-bar,.cko-veil>*{animation:cko-in .22s cubic-bezier(.2,.8,.2,1)}}
@keyframes cko-in{from{opacity:0;transform:translateY(8px)}}
@media (forced-colors:active){.cko-sw{border:1px solid CanvasText}.cko-sw:checked{background:Highlight}}
@media print{.cko{display:none}}`;

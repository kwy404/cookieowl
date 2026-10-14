// NightPixel: a pretend conversion pixel, injected at runtime by a vendor
// style snippet, to show the auto blocker catching document.createElement.
(function () {
  var net = window.demoNet;
  if (!net) return;
  document.cookie = '_nightpixel=np.' + Date.now() + '; Path=' + net.cookiePath + '; Max-Age=7776000; SameSite=Lax';
  net.ran('demo/trackers/pixel.js');
  net.request('NightPixel PageView', 'https://pixel.example/tr?ev=PageView&noscript=0', 'marketing');
})();

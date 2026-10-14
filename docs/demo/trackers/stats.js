// StarStats: a pretend analytics tracker for the cookieowl demo. It sets a
// cookie and reports a page view to the demo network monitor. No request
// leaves this page.
(function () {
  var net = window.demoNet;
  if (!net) return;
  var id = 'ss.' + Math.random().toString(36).slice(2, 10);
  document.cookie = '_starstats_id=' + id + '; Path=' + net.cookiePath + '; Max-Age=31536000; SameSite=Lax';
  net.ran('demo/trackers/stats.js');
  net.request('StarStats page view', 'https://stats.example/collect?v=2&cid=' + id + '&dl=%2Fshop', 'analytics');
})();

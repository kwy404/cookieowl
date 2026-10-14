// Retargeting ads: a pretend advertising tag for the cookieowl demo.
(function () {
  var net = window.demoNet;
  if (!net) return;
  var uid = 'na.' + Math.random().toString(36).slice(2, 10);
  document.cookie = '_nightads_uid=' + uid + '; Path=' + net.cookiePath + '; Max-Age=7776000; SameSite=Lax';
  net.ran('demo/trackers/ads.js');
  net.request('Ad audience sync', 'https://ads.example/sync?uid=' + uid + '&segment=coffee-lovers', 'marketing');
})();

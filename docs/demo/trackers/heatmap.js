// Heatmap recorder: a pretend session recorder for the cookieowl demo. It keeps
// sending batches while it runs, which is why withdrawing consent has to stop
// it (on a real site, cookieowl reloads the page).
(function () {
  var net = window.demoNet;
  if (!net) return;
  var sid = 'hj.' + Math.random().toString(36).slice(2, 8);
  var batch = 0;
  document.cookie = '_heat_session=' + sid + '; Path=' + net.cookiePath + '; SameSite=Lax';
  net.ran('demo/trackers/heatmap.js');
  var timer = setInterval(function () {
    batch += 1;
    net.request('Heatmap batch ' + batch, 'https://heat.example/record?sid=' + sid + '&events=' + (12 + batch * 7), 'analytics');
    if (batch >= 4) clearInterval(timer);
  }, 2500);
  net.onStop(function () {
    clearInterval(timer);
  });
})();

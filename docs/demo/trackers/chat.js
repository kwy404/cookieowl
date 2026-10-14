// Live chat widget: a pretend preferences feature for the cookieowl demo. It
// remembers a language and shows a chat bubble in the demo shop.
(function () {
  var net = window.demoNet;
  if (!net) return;
  document.cookie = 'chat_lang=en; Path=' + net.cookiePath + '; Max-Age=2592000; SameSite=Lax';
  net.ran('demo/trackers/chat.js');
  var site = document.querySelector('[data-demo-site]');
  if (site && !site.querySelector('.ds-chat')) {
    var b = document.createElement('div');
    b.className = 'ds-chat';
    b.textContent = 'Chat with a barista';
    site.appendChild(b);
  }
  net.request('Chat widget config', 'https://chat.example/widget?lang=en', 'preferences');
})();

export const loadKeystrokeDna = ({ appId, onLoad }) => {
  const KSDNA_SDK_URL = `https://api.keystrokedna.com/static/v0.4.1/ksdna.js?apiKey=${appId}`;
  window.KSDNA = window.KSDNA || {
    f: [],
    ready(callback) {
      if (window.KSDNA.loaded) {
        callback();
      } else {
        this.f.push(callback);
      }
    },
  };
  const script = document.createElement('script');
  const firstScript = document.getElementsByTagName('script')[0];
  script.ksdna = 1;
  script.async = 1;
  script.src = KSDNA_SDK_URL;
  script.onload = onLoad;
  firstScript.parentNode.insertBefore(script, firstScript);
};
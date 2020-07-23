import _ from 'lodash';

export const loadKeystrokeDna = ({ appId }) => new Promise((resolve) => {
  const isKSDNALoaded = _.get(window, 'KSDNA.loaded', false);
  if (isKSDNALoaded) {
    return resolve();
  }
  const KSDNA_SDK_URL = `https://api.keystrokedna.com/static/v0.4.1/ksdna.js?apiKey=${appId}`;
  window.KSDNA = window.KSDNA || {
    f: [],
    ready(callback) {
      if (isKSDNALoaded) {
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
  script.onload = () => resolve();
  return firstScript.parentNode.insertBefore(script, firstScript);
});

export const initKeystrokeDna = () => window.KSDNA.ready(() => window.KSDNA.init());

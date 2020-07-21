import { parseJsonSafe } from './utils';

export const getLocalStorage = () => {
  const json = window.localStorage.getItem(process.env.LOCAL_STORAGE_KEY);
  return parseJsonSafe(json) || {};
};

export const updateLocalStorage = (fragment = {}) => {
  const data = getLocalStorage() || {};
  return window.localStorage.setItem(process.env.LOCAL_STORAGE_KEY, JSON.stringify({
    ...data,
    ...fragment,
  }));
};
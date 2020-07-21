export const parseJsonSafe = (json) => {
  try {
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
};
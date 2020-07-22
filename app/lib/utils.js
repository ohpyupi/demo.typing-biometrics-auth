export const parseJsonSafe = (json) => {
  try {
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
};

export const parseJwtSafe = (jwtToken) => {
  try {
    return parseJsonSafe(atob(jwtToken.split('.')[1]));
  } catch (err) {
    return null;
  }
};

import { JWT_TOKEN_NAME } from "./constants";

export const setLocalStorage = (token) =>
  localStorage.setItem(JWT_TOKEN_NAME, token);

export const getLocalStorage = () => localStorage.getItem(JWT_TOKEN_NAME);
export const removeLocalStorage = () => localStorage.removeItem(JWT_TOKEN_NAME);

export const parseJWT = (token) => {
  if (token === null) return null;
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

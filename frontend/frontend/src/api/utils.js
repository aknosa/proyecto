import jwt from "jwt-decode";
import axios from "axios";

const ENDPOINT = "http://localhost:3000";

export async function login(email, password) {
  let data = {
    email,
    password,
  };
  const response = await axios.post(`${ENDPOINT}/users/login`, data);
  setAuthToken(response.data.data.token);
}

export const config = {
  headers: {
    Authorization: getAuthToken(),
  },
};

export function setAuthToken(token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("AUTH_TOKEN_KEY", token);
}

export function getAuthToken() {
  return localStorage.getItem("AUTH_TOKEN_KEY");
}

export function tokenExpiration(encodedToken) {
  let token = jwt(encodedToken);
  if (!token.exp) {
    return null;
  }
  let date = new Date(0);
  date.setUTCSeconds(token.exp);
  return date;
}

export function isExpired(token) {
  let expirationDate = tokenExpiration(token);
  return expirationDate < new Date();
}

//Función para sacar id del token
export function tokenData(encodedToken) {
  let token = jwt(encodedToken);
  if (token.id) {
    return token.id;
  } else {
    return null;
  }
}

//Función que comprueba si la persona esté logeada y su token es válido
export function isLoggedIn() {
  let authToken = getAuthToken();
  return !!authToken && !isExpired(authToken);
}

//Función de logout
export function logout() {
  axios.defaults.headers.common["Authorization"] = "";
  localStorage.removeItem("AUTH_TOKEN_KEY");
  localStorage.removeItem("ROLE");
  localStorage.removeItem("NAME");
}

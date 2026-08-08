export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const setToken = (token) => {
  localStorage.setItem("token", token);
};
export const getToken = () => {
  return localStorage.getItem("token");
};
export const clearUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
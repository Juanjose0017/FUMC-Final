export const environment = {
  production: false,
  apiUrl: window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'http://192.168.1.81:8080'
};

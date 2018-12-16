export const constants = {
    host: 'http://localhost:',
    backEndPort: '8080',
    frontEndPort: '4200',
    get backEndUrl() {
      return this.host + this.backEndPort;
    },
    get frontEndUrl() {
      return this.host + this.frontEndPort;
    },
    routes: {
      registration: '/api/users',
      login: '/api/login',
      get_profile: '/api/profile'
    }
};

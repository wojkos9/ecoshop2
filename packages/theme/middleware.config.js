module.exports = {
  integrations: {
    ecoshop: { // name of your integration
      location: '@vue-storefront/ecoshop-api/server', // name of your api-client package followed by `/server`
      configuration: {
        api: {
          url: 'http://localhost:8000' // URL of your e-commerce platform
        }
      }
    }
  }
};

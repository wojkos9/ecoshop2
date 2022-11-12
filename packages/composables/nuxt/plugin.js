import { integrationPlugin } from '@vue-storefront/core';

const moduleOptions = <%= serialize(options) %>;

export default integrationPlugin(({ app, integration }) => {
  integration.configure('ecoshop', {
    ...moduleOptions,
    // other options
    app
  });
});

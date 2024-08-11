'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/document/:userid', // Define the custom route
      handler: 'document.findByUserId', // The controller action to handle this route
      config: {
        policies: [], // Add any policies if needed
        middlewares: [], // Add any middlewares if needed
      },
    },
  ],
};

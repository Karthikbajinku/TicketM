const path = require('path');

module.exports = {
  devServer: {
    client: {
      logging: 'warn',
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      // Suppress [object Event] logs
      const originalLog = console.log;
      console.log = (...args) => {
        const stringArgs = args.map(arg => {
          if (typeof arg === 'object' && arg !== null && arg.constructor === Event) {
            return `[Event: ${arg.type}]`;
          }
          return arg;
        });
        originalLog.apply(console, stringArgs);
      };
      
      return middlewares;
    },
  },
};

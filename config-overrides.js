const { override, adjustStyleLoaders } = require('customize-cra');
const path = require('path');

module.exports = override(
  (config) => {
    // Customize output filenames
    config.output.filename = 'static/js/main.js';
    config.plugins.forEach(plugin => {
      if (plugin.constructor.name === 'MiniCssExtractPlugin') {
        plugin.options.filename = 'static/css/main.css';
      }
    });

    return config;
  }
);
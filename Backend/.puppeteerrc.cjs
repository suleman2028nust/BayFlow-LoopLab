const { join } = require('path');

/**
 * Ensures Puppeteer stores the downloaded Chrome browser inside the project
 * directory so Render preserves it between build and runtime.
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
